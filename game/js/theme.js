// This is the carto public api key
import { CARTO_KEY } from '../../env.js';

// URLs des styles vectoriels CARTO sans labels
const darkStyleUrl = `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json?key=${CARTO_KEY}`;
const lightStyleUrl = `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${CARTO_KEY}`;

// Initialisation de la détection du thème système
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

// Initialisation de MapLibre
export const map = new maplibregl.Map({
    container: 'map',
    style: mediaQuery.matches ? darkStyleUrl : lightStyleUrl,
    zoom: 1,
    center: [150.16546137527212, -35.017179237129994],
    pitch: 0,
    maxPitch: 85,
    canvasContextAttributes: { antialias: true },
    attributionControl: false
});

// Masque les calques de texte/labels natifs du style vectoriel CARTO
function hideLabels(mapInstance) {
    const style = mapInstance.getStyle();
    if (style && style.layers) {
        style.layers.forEach((layer) => {
            if (layer.type === 'symbol') {
                mapInstance.setLayoutProperty(layer.id, 'visibility', 'none');
            }
        });
    }
}

// Gestion des contrôles de navigation
map.dragRotate.disable();
map.keyboard.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.AttributionControl(), 'top-left');

// Configuration de la projection globe et masquage des labels au chargement
map.on('style.load', () => {
    map.setProjection({ type: 'globe' });
    hideLabels(map);
});

// Écouteur de changement de thème dynamique (Préserve vos calques GeoJSON)
mediaQuery.addEventListener('change', (e) => {
    const newStyleUrl = e.matches ? darkStyleUrl : lightStyleUrl;

    // 1. Sauvegarde des sources et calques GeoJSON personnalisés actuels
    const currentStyle = map.getStyle();
    const customSources = {};
    const customLayers = [];

    if (currentStyle && currentStyle.sources) {
        Object.keys(currentStyle.sources).forEach(sourceId => {
            // Sauvegarde uniquement vos sources personnalisées (pas celles de CARTO)
            if (sourceId !== 'carto' && sourceId !== 'carto-vector') {
                customSources[sourceId] = currentStyle.sources[sourceId];
            }
        });
    }

    if (currentStyle && currentStyle.layers) {
        currentStyle.layers.forEach(layer => {
            // Sauvegarde uniquement les calques liés à vos sources GeoJSON
            if (layer.source && customSources[layer.source]) {
                customLayers.push(layer);
            }
        });
    }

    // 2. Application du nouveau style vectoriel
    map.setStyle(newStyleUrl);

    // 3. Restauration de la configuration et de vos calques GeoJSON
    map.once('style.load', () => {
        map.setProjection({ type: 'globe' });
        hideLabels(map);

        // Réinjection des sources GeoJSON
        Object.keys(customSources).forEach(sourceId => {
            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, customSources[sourceId]);
            }
        });

        // Réinjection des calques GeoJSON
        customLayers.forEach(layer => {
            if (!map.getLayer(layer.id)) {
                map.addLayer(layer);
            }
        });

        // Mise à jour des couleurs pour le nouveau thème
        borderColor.updateLayers(e.matches, map);
    });
});

// Gestion des couleurs pour vos GeoJSON
export const borderColor = {
    updateLayers(isDark, mapDiv = map) {
        const colorFill = isDark ? this.darkMainFill : this.lightMainFill;
        const colorBorder = isDark ? this.darkMainBorder : this.lightMainBorder;

        const fillSelected = isDark ? this.darkSelectedFill : this.lightSelectedFill;
        const borderSelected = isDark ? this.darkSelectedBorder : this.lightSelectedBorder;

        const fill_Good = isDark ? this.dark_good_fill : this.light_good_fill;
        const border_Good = isDark ? this.dark_good_border : this.light_good_border;

        const fill_miss = isDark ? this.dark_miss_fill : this.light_miss_fill;
        const border_miss = isDark ? this.dark_miss_border : this.light_miss_border;

        const fill_fail = isDark ? this.dark_fail_fill : this.light_fail_fill;
        const border_fail = isDark ? this.dark_fail_border : this.light_fail_border;

        const fill_ignore = isDark ? this.dark_ignore_fill : this.light_ignore_fill;
        const border_ignore = isDark ? this.dark_ignore_border : this.light_ignore_border;

        const fillExpression = [
            'case',
            ['==', ['feature-state', 'status'], 'correct'], fill_Good,
            ['==', ['feature-state', 'status'], 'missed'], fill_miss,
            ['==', ['feature-state', 'status'], 'wrong'], fill_fail,
            ['==', ['feature-state', 'status'], 'selected'], fillSelected,
            ['==', ['feature-state', 'status'], 'ignore'], fill_ignore,
            ['==', ['feature-state', 'status'], 'hidden'], "#ffffff00",
            ['coalesce', ['get', 'color'], colorFill]
        ];

        const lineExpression = [
            'case',
            ['==', ['feature-state', 'status'], 'correct'], border_Good,
            ['==', ['feature-state', 'status'], 'missed'], border_miss,
            ['==', ['feature-state', 'status'], 'wrong'], border_fail,
            ['==', ['feature-state', 'status'], 'selected'], borderSelected,   
            ['==', ['feature-state', 'status'], 'ignore'], border_ignore,
            ['==', ['feature-state', 'status'], 'hidden'], "#ffffff00",
            ['coalesce', ['get', 'borderColor'], colorBorder]          
        ];

        // Application aux calques MapLibre s'ils existent dans la carte
        if (mapDiv.getLayer('territories-fill')) {
            mapDiv.setPaintProperty('territories-fill', 'fill-color', fillExpression);
            mapDiv.setPaintProperty('territories-circles-fill', 'fill-color', fillExpression);
            mapDiv.setPaintProperty('territories-line', 'line-color', lineExpression);
            mapDiv.setPaintProperty('territories-circles-line', 'line-color', lineExpression);
        }
    },
    init(mapDiv = map) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.updateLayers(mediaQuery.matches, mapDiv);

        mediaQuery.addEventListener('change', (e) => {
            this.updateLayers(e.matches, mapDiv);
        });
    },
    darkMainFill: "rgb(180, 180, 180)",
    darkMainBorder: "rgb(143, 143, 143)",
    lightMainFill: "rgb(95, 95, 95)",
    lightMainBorder: "rgb(54, 54, 54)",
    
    darkSelectedFill: "#8989ee",
    darkSelectedBorder: "#8181eb",
    lightSelectedFill: "#3030bd",
    lightSelectedBorder: "#242475",

    dark_good_fill: "#8cec90",
    dark_good_border: "#80e485",
    light_good_fill: "#3b9e3f",
    light_good_border: "#256427",

    dark_miss_fill: "#dfa16e",
    dark_miss_border: "#e6ab74",
    light_miss_fill: "#b35102",
    light_miss_border: "#6b3000",

    dark_fail_fill: "#ec8c8c",
    dark_fail_border: "#e48080",
    light_fail_fill: "#9e3b3b",
    light_fail_border: "#642525",

    dark_ignore_fill: "rgb(75, 75, 75)",
    dark_ignore_border: "rgb(46, 46, 46)",
    light_ignore_fill: "rgb(187, 187, 187)",
    light_ignore_border: "rgb(184, 184, 184)",
};