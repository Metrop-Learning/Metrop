// Theme map init (to be change to custom)
const darkTiles = [
    'https://a.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
    'https://b.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png',
    'https://c.basemaps.cartocdn.com/rastertiles/dark_nolabels/{z}/{x}/{y}.png'
];

const lightTiles = [
    'https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
    'https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',
    'https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png'
];

// Init tiles
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let tilesLayer = mediaQuery.matches ? darkTiles : lightTiles;

// Map init
export const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            carto: {
                type: 'raster',
                tiles: tilesLayer,
                tileSize: 256,
                attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        },
        layers: [
            {
                id: 'carto-base',
                type: 'raster',
                source: 'carto'
            }
        ]
    },
    zoom: 1,
    center: [150.16546137527212, -35.017179237129994],
    pitch: 0,
    maxPitch: 85,
    canvasContextAttributes: { antialias: true },
    attributionControl: false
});

// Controll management
map.dragRotate.disable();
map.keyboard.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new maplibregl.AttributionControl(), 'top-left');
//Broken control :
//map.addControl(new maplibregl.FullscreenControl(), 'top-right');

map.on('style.load', () => {
     map.setProjection({ type: 'globe' });
});


// Dynamic theme
mediaQuery.addEventListener('change', (e) => {
    const baseSource = map.getSource('carto');
    
    if (baseSource) {
        if (e.matches) {
            baseSource.setTiles(darkTiles);
        } else {
            baseSource.setTiles(lightTiles);
        }
    }
});

export const borderColor = {
    updateLayers(isDark,mapDiv=map) {
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

        // Application aux calques Maplibre
        mapDiv.setPaintProperty('territories-fill', 'fill-color', fillExpression);
        mapDiv.setPaintProperty('territories-circles-fill', 'fill-color', fillExpression);
        mapDiv.setPaintProperty('territories-line', 'line-color', lineExpression);
        mapDiv.setPaintProperty('territories-circles-line', 'line-color', lineExpression);
    },
    init(mapDiv=map) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.updateLayers(mediaQuery.matches,mapDiv);

        mediaQuery.addEventListener('change', (e) => {
            this.updateLayers(e.matches,mapDiv);
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
}