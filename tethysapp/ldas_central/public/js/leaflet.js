////////////////////////////////////////////////////////////////////////  MAP FUNCTIONS
function map() {
    // create the map
    return L.map('map', {
        zoom: 6,
        minZoom: 5,
        boxZoom: true,
        maxBounds: L.latLngBounds(L.latLng(0, -100), L.latLng(30, -60)),
        center: [13, -86],
        timeDimension: true,
        timeDimensionControl: true,
        timeDimensionControlOptions: {
            position: "bottomleft",
            autoPlay: true,
            loopButton: true,
            backwardButton: true,
            forwardButton: true,
            timeSliderDragUpdate: true,
            minSpeed: 1,
            maxSpeed: 6,
            speedStep: 1,
        },
    });
}

function basemaps() {
    // create the basemap layers
    let Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    let Esri_WorldTerrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {maxZoom: 13});
    let Esri_Imagery_Labels = L.esri.basemapLayer('ImageryLabels');
    return {
        "ESRI Imagery": L.layerGroup([Esri_WorldImagery, Esri_Imagery_Labels]).addTo(mapObj),
        "ESRI Terrain": L.layerGroup([Esri_WorldTerrain, Esri_Imagery_Labels])
    }
}

////////////////////////////////////////////////////////////////////////  WMS LAYERS FOR GLDAS
function newLayer() {
    let wmsurl = threddsbase + $("#dates").val() + '.ncml';
    let wmsLayer = L.tileLayer.wms(wmsurl, {
        // version: '1.3.0',
        layers: $("#variables").val(),
        dimension: 'time',
        useCache: true,
        crossOrigin: false,
        format: 'image/png',
        transparent: true,
        opacity: $("#opacity_raster").val(),
        BGCOLOR: '0x000000',
        styles: 'boxfill/' + $('#colorscheme').val(),
        colorscalerange: bounds[$("#dates").val()][$("#variables").val()],
    });

    let timedLayer = L.timeDimension.layer.wms(wmsLayer, {
        name: 'time',
        requestTimefromCapabilities: true,
        updateTimeDimension: true,
        updateTimeDimensionMode: 'replace',
        cache: 20,
    }).addTo(mapObj);

    return timedLayer
}

////////////////////////////////////////////////////////////////////////  LEGEND DEFINITIONS
let legend = L.control({position: 'topright'});
legend.onAdd = function (mapObj) {
    let div = L.DomUtil.create('div', 'legend');
    let url = threddsbase + $("#dates").val() + '.ncml' + "?REQUEST=GetLegendGraphic&LAYER=" + $("#variables").val() + "&PALETTE=" + $('#colorscheme').val() + "&COLORSCALERANGE=" + bounds[$("#dates").val()][$("#variables").val()];
    div.innerHTML = '<img src="' + url + '" alt="legend" style="width:100%; float:right;">';
    return div
};

////////////////////////////////////////////////////////////////////////  GEOJSON LAYERS - GEOSERVER + WFS / GEOJSON
let currentregion = '';              // tracks which region is on the chart for updates not caused by the user picking a new region
function layerPopups(feature, layer) {
    let region = feature.properties.name;
    layer.bindPopup('<a class="btn btn-default" role="button" onclick="getShapeChart(' + "'" + region + "'" + ')">Get timeseries of averages for ' + region + '</a>');
}

// declare a placeholder layer for all the geojson layers you want to add
let jsonparams = {
    onEachFeature: layerPopups,
    style: {color: $("#colors_geojson").val(), opacity: $("#opacity_geojson").val()}
};
let belize = L.geoJSON(false, jsonparams);
let costarica = L.geoJSON(false, jsonparams);
let elsalvador = L.geoJSON(false, jsonparams);
let guatemala = L.geoJSON(false, jsonparams);
let honduras = L.geoJSON(false, jsonparams);
let nicaragua = L.geoJSON(false, jsonparams);
let panama = L.geoJSON(false, jsonparams);

// create this reference array that other functions will build on
const geojsons = [
    [belize, 'belize', {}],
    [costarica, 'costarica', {}],
    [elsalvador, 'elsalvador', {}],
    [guatemala, 'guatemala', {}],
    [honduras, 'honduras', {}],
    [nicaragua, 'nicaragua', {}],
    [panama, 'panama', {}],
];

// gets the geojson layers from geoserver wfs and updates the layer
function getWFSData(geoserverlayer, leafletlayer) {
    // http://jsfiddle.net/1f2Lxey4/2/
    let parameters = L.Util.extend({
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'gldas:' + geoserverlayer,
        maxFeatures: 10000,
        outputFormat: 'application/json',
        parseResponse: 'getJson',
        srsName: 'EPSG:4326',
        crossOrigin: 'anonymous'
    });
    $.ajax({
        async: true,
        jsonp: false,
        url: geoserverbase + L.Util.getParamString(parameters),
        contentType: 'application/json',
        success: function (data) {
            leafletlayer.addData(data).addTo(mapObj);
        },
    });
}

function updateGEOJSON() {
    if (geoserverbase === 'geojson') {
        for (let i = 0; i < geojsons.length; i++) {
            geojsons[i][0].addData(geojsons[i][2]).addTo(mapObj);
        }
    } else {
        for (let i = 0; i < geojsons.length; i++) {
            getWFSData(geojsons[i][1], geojsons[i][0]);
        }
    }
}

function styleGeoJSON() {
    // determine the styling to apply
    let style = {
        color: $("#colors_geojson").val(),
        opacity: $("#opacity_geojson").val(),
    };
    // apply it to all the geojson layers
    for (let i = 0; i < geojsons.length; i++) {
        geojsons[i][0].setStyle(style);
    }
}

////////////////////////////////////////////////////////////////////////  MAP CONTROLS AND CLEARING
// the layers box on the top right of the map
function makeControls() {
    return L.control.layers(basemapObj, {
        'GLDAS Layer': layerObj,
        'Drawing': drawnItems,
        'Belize': belize,
        'Costa Rica': costarica,
        'El Salvador': elsalvador,
        'Guatemala': guatemala,
        'Honduras': honduras,
        'Nicaragua': nicaragua,
        'Panama': panama,
    }).addTo(mapObj);
}

// you need to remove layers when you make changes so duplicates dont persist and accumulate
function clearMap() {
    // remove the controls for the wms layer then remove it from the map
    controlsObj.removeLayer(layerObj);
    mapObj.removeLayer(layerObj);
    // now do it for all the geojson layers
    for (let i = 0; i < geojsons.length; i++) {
        controlsObj.removeLayer(geojsons[i][0]);
        mapObj.removeLayer(geojsons[i][0]);
    }
    // now delete the controls object
    mapObj.removeControl(controlsObj);
}
