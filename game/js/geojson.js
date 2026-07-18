import {map} from "./theme.js";
import * as theme from './theme.js';
import * as main from "./main.js";
import * as pTM from "./renderer/placeTerritoriesManager.js";

let hoveredId = null;

export function addGeojsonListToExistingMap(geojsonList,mapDiv=map) {
    // Fusion
    const combinedFeatures = geojsonList.flatMap((geojson, index) => {
        if (geojson.type === 'FeatureCollection') {
            return geojson.features.map(feature => {
                feature.id = index;
                feature.properties = { ...feature.properties, listIndex: index };
                return feature;
            });
        } else if (geojson.type === 'Feature') {
            geojson.id = index;
            geojson.properties = { ...geojson.properties, listIndex: index };
            return [geojson];
        } else {
            return [{
                type: 'Feature',
                id: index,
                geometry: geojson,
                properties: { listIndex: index }
            }];
        }
    });

    const combinedGeoJSON = {
        type: 'FeatureCollection',
        features: combinedFeatures
    };

    // Add to the map
    mapDiv.addSource('combined-territories', {
        type: 'geojson',
        data: combinedGeoJSON,
        promoteId: 'listIndex' // Important
    });

    const bounds = new maplibregl.LngLatBounds();
    let hasCoordinates = false;

    function extractCoords(coords) {
        if (Array.isArray(coords) && typeof coords[0] === 'number') {
            bounds.extend(coords);
            hasCoordinates = true;
        } else if (Array.isArray(coords)) {
            coords.forEach(extractCoords);
        }
    }

    combinedFeatures.forEach(feature => {
        if (feature.geometry && feature.geometry.coordinates) {
            extractCoords(feature.geometry.coordinates);
        }
    });

    // Fill (Country)
    mapDiv.addLayer({
        id: 'territories-fill',
        type: 'fill',
        source: 'combined-territories',
        filter: ['!', ['has', 'isCircle']],
        paint: {
            'fill-color': ['coalesce', ['get', 'color'], 'rgb(107, 107, 116)'],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.8,
                0.4 
            ]
        }
    });

    // Border (Country)
    mapDiv.addLayer({
        id: 'territories-line',
        type: 'line',
        source: 'combined-territories',
        filter: ['!', ['has', 'isCircle']],
        paint: {
            'line-color': ['coalesce', ['get', 'borderColor'], 'rgb(107, 107, 107)'],
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                2,
                1 
            ]
        }
    });

    // Fill (Circle)
    mapDiv.addLayer({
        id: 'territories-circles-fill',
        type: 'fill',
        source: 'combined-territories',
        filter: ['has', 'isCircle'],
        paint: {
            'fill-color': ['coalesce', ['get', 'color'], 'rgb(107, 107, 116)'],
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.9,
                0.6
            ]
        }
    });

    // Border (Circle)
    mapDiv.addLayer({
        id: 'territories-circles-line',
        type: 'line',
        source: 'combined-territories',
        filter: ['has', 'isCircle'],
        paint: {
            'line-color': ['coalesce', ['get', 'borderColor'], 'rgb(107, 107, 107)'],
            'line-width': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                4,
                1.5 
            ]
        }
    });

    setupMapListeners(mapDiv);

    theme.borderColor.init(mapDiv)
    
    
    if (hasCoordinates) {
        return bounds
    }
}

function setupMapListeners(mapDiv) {
    const targetLayers = ['territories-fill', 'territories-circles-fill'];

    targetLayers.forEach(layerId => {
        mapDiv.on('mousemove', layerId, (e) => {
            if (e.features.length > 0) {
                mapDiv.getCanvas().style.cursor = 'pointer';
                const currentIndex = e.features[0].properties.listIndex;
                if (hoveredId !== null && hoveredId !== currentIndex) {
                    mapDiv.setFeatureState(
                        { source: 'combined-territories', id: hoveredId },
                        { hover: false }
                    );
                }
                
                if(main.type == "placeTerritory" && main.config.isTerritoryLock() && pTM.selector > currentIndex){
                    return
                }

                hoveredId = currentIndex;
                mapDiv.setFeatureState(
                    { source: 'combined-territories', id: hoveredId },
                    { hover: true }
                );
            }
        });

        mapDiv.on('mouseleave', layerId, () => {
            mapDiv.getCanvas().style.cursor = '';
            if (hoveredId !== null) {
                mapDiv.setFeatureState(
                    { source: 'combined-territories', id: hoveredId },
                    { hover: false }
                );
            }
            hoveredId = null;
        });
    });
}

export function changeState(indexPays, statut, mapDiv=map) {
    mapDiv.setFeatureState(
        { 
            source: 'combined-territories', 
            id: indexPays
        },
        { 
            status: statut
        }
    );
}


export function adjustCamCountry(indexPays, geojsonList, mapDiv=map,anim=1200) {
    const geojson = geojsonList[indexPays];
    
    if (!geojson) {
        console.error(`No geojson found ${indexPays}`);
        return;
    }

    const bounds = new maplibregl.LngLatBounds();
    let hasCoordinates = false;

    function extractCoords(coords) {
        if (Array.isArray(coords) && typeof coords[0] === 'number') {
            bounds.extend(coords);
            hasCoordinates = true;
        } else if (Array.isArray(coords)) {
            coords.forEach(extractCoords);
        }
    }

    if (geojson.type === 'FeatureCollection') {
        geojson.features.forEach(f => {
            if (f.geometry && f.geometry.coordinates) extractCoords(f.geometry.coordinates);
        });
    } else if (geojson.type === 'Feature') {
        if (geojson.geometry && geojson.geometry.coordinates) extractCoords(geojson.geometry.coordinates);
    } else if (geojson.geometry && geojson.geometry.coordinates) {
        extractCoords(geojson.geometry.coordinates);
    } else if (geojson.coordinates) {
        extractCoords(geojson.coordinates);
    }

    if (hasCoordinates) {
        let dynamicPadding = 100;
        if(anim != 0){
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            const nw = bounds.getNorthWest();

            const widthKm = nw.distanceTo(ne) / 1000;
            const heightKm = nw.distanceTo(sw) / 1000;
            const maxDimensionKm = Math.max(widthKm, heightKm);

            const mapWidth = mapDiv.getCanvas().clientWidth;
            const mapHeight = mapDiv.getCanvas().clientHeight;
            
            const minScreenDimension = Math.min(mapWidth, mapHeight);

            const pctMinPadding = 0.10; 
            const pctMaxPadding = 0.40; 

            const minAllowedPadding = minScreenDimension * pctMinPadding;
            const maxAllowedPadding = minScreenDimension * pctMaxPadding;
            
            const maxCountrySizeKm = 4000; 

            const sizeRatio = Math.min(maxDimensionKm / maxCountrySizeKm, 1);

            dynamicPadding = maxAllowedPadding - (sizeRatio * (maxAllowedPadding - minAllowedPadding));

            console.info(`Screen Min: ${minScreenDimension}px | Padding : ${dynamicPadding}px | Size Territory: ${maxDimensionKm}km`);
        }
        mapDiv.fitBounds(bounds, {
            padding: dynamicPadding,      
            duration: anim    
        });
    }
}