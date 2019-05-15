////////////////////////////////////////////////////////////////////////  MAP VARIABLES
let belize = L.geoJSON();
let costarica = L.geoJSON();
let cuba = L.geoJSON();
let centralamerica = L.geoJSON();
let dominicanrepublic = L.geoJSON();
let elsalvador = L.geoJSON();
let guatemala = L.geoJSON();
let haiti = L.geoJSON();
let honduras = L.geoJSON();
let jamaica = L.geoJSON();
let mexico = L.geoJSON();
let nicaragua = L.geoJSON();
let panama = L.geoJSON();

////////////////////////////////////////////////////////////////////////  MAP FUNCTIONS
function map() {
    // create the map
    return L.map('map', {
        zoom: 4,
        minZoom: 1,
        boxZoom: true,
        maxBounds: L.latLngBounds(L.latLng(0, -120.0), L.latLng(40, -40)),
        center: [21, -86],
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
        opacity: $("#opacity").val(),
        BGCOLOR: '0x000000',
        styles: 'boxfill/' + $('#colors').val(),
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
        jsonpCallback: 'getJson',  // name of the function to fire on jsonpCallback
        success: function (data) {
            leafletlayer.addData(data);
        },
    });
}

function updateGEOJSON() {
    getWFSData('belize', belize);
    getWFSData('costarica', costarica);
    getWFSData('cuba', cuba);
    getWFSData('centralamerica', centralamerica);
    getWFSData('dominicanrepublic', dominicanrepublic);
    getWFSData('elsalvador', elsalvador);
    getWFSData('guatemala', guatemala);
    getWFSData('haiti', haiti);
    getWFSData('honduras', honduras);
    getWFSData('jamaica', jamaica);
    getWFSData('mexico', mexico);
    getWFSData('nicaragua', nicaragua);
    getWFSData('panama', panama);
}

function makeControls() {
    return L.control.layers(basemapObj, {
        'GLDAS Layer': layerObj,
        'Drawing': drawnItems,
        'Belize': belize,
        'Costa Rica': costarica,
        'Cuba': cuba,
        'Central America': centralamerica,
        'Dominican Republic': dominicanrepublic,
        'El Salvador': elsalvador,
        'Guatemala': guatemala,
        'Haiti': haiti,
        'Honduras': honduras,
        'Jamaica': jamaica,
        'Mexico': mexico,
        'Nicaragua': nicaragua,
        'Panama': panama,
    }).addTo(mapObj);
}

function clearMap() {
    controlsObj.removeLayer(layerObj);
    controlsObj.removeLayer(africa);
    controlsObj.removeLayer(belize);
    controlsObj.removeLayer(costarica);
    controlsObj.removeLayer(cuba);
    controlsObj.removeLayer(centralamerica);
    controlsObj.removeLayer(dominicanrepublic);
    controlsObj.removeLayer(elsalvador);
    controlsObj.removeLayer(guatemala);
    controlsObj.removeLayer(haiti);
    controlsObj.removeLayer(honduras);
    controlsObj.removeLayer(jamaica);
    controlsObj.removeLayer(mexico);
    controlsObj.removeLayer(nicaragua);
    controlsObj.removeLayer(panama);
    mapObj.removeLayer(layerObj);
    mapObj.removeLayer(africa);
    mapObj.removeLayer(belize);
    mapObj.removeLayer(costarica);
    mapObj.removeLayer(cuba);
    mapObj.removeLayer(centralamerica);
    mapObj.removeLayer(dominicanrepublic);
    mapObj.removeLayer(elsalvador);
    mapObj.removeLayer(guatemala);
    mapObj.removeLayer(haiti);
    mapObj.removeLayer(honduras);
    mapObj.removeLayer(jamaica);
    mapObj.removeLayer(mexico);
    mapObj.removeLayer(nicaragua);
    mapObj.removeLayer(panama);
    mapObj.removeControl(controlsObj);
}

////////////////////////////////////////////////////////////////////////  LEGEND DEFINITIONS
let legend = L.control({position: 'topright'});
legend.onAdd = function (mapObj) {
    let div = L.DomUtil.create('div', 'legend');
    let url = threddsbase + $("#dates").val() + '.ncml' + "?REQUEST=GetLegendGraphic&LAYER=" + $("#variables").val() + "&PALETTE=" + $('#colors').val() + "&COLORSCALERANGE=" + bounds[$("#dates").val()][$("#variables").val()];
    div.innerHTML = '<img src="' + url + '" alt="legend" style="width:100%; float:right;">';
    return div
};