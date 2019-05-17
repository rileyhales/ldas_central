from .app import LdasCentral as App
import os


def app_configuration():
    """
    Gets the settings for the app for use in other functions and ajax for leaflet
    Dependencies: os, App (app)
    """
    return {
        'app_wksp_path': os.path.join(App.get_app_workspace().path, ''),
        'threddsurl': App.get_custom_setting("Thredds WMS URL"),
        'geoserverurl': App.get_custom_setting("Geoserver Workspace URL"),
        'threddsdatadir': App.get_custom_setting("Local Thredds Folder Path"),
    }


def gldas_variables():
    """
    List of the plottable variables from the GLDAS 2.1 datasets used
    """
    return {
        'Air Temperature': 'Tair_f_inst',
        'Surface Albedo': 'Albedo_inst',
        'Surface Temperature': 'AvgSurfT_inst',
        'Canopy Water Amount': 'CanopInt_inst',
        'Evaporation Flux From Canopy': 'ECanop_tavg',
        'Evaporation Flux From Soil': 'ESoil_tavg',
        'Water Evaporation Flux': 'Evap_tavg',
        'Surface Downwelling Longwave Flux In Air': 'LWdown_f_tavg',
        'Surface Net Downward Longwave Flux': 'Lwnet_tavg',
        'Potential Evaporation Flux': 'PotEvap_tavg',
        'Surface Air Pressure': 'Psurf_f_inst',
        'Specific Humidity': 'Qair_f_inst',
        'Downward Heat Flux In Soil': 'Qg_tavg',
        'Surface Upward Sensible Heat Flux': 'Qh_tavg',
        'Surface Upward Latent Heat Flux': 'Qle_tavg',
        'Surface Runoff Amount': 'Qs_acc',
        'Subsurface Runoff Amount': 'Qsb_acc',
        'Surface Snow Melt Amount': 'Qsm_acc',
        'Precipitation Flux': 'Rainf_f_tavg',
        'Rainfall Flux': 'Rainf_tavg',
        'Root Zone Soil Moisture': 'RootMoist_inst',
        'Surface Snow Amount': 'SWE_inst',
        'Soil Temperature': 'SoilTMP0_10cm_inst',
        'Surface Downwelling Shortwave Flux In Air': 'SWdown_f_tavg',
        'Surface Snow Thickness': 'SnowDepth_inst',
        'Snowfall Flux': 'Snowf_tavg',
        'Surface Net Downward Shortwave Flux': 'Swnet_tavg',
        'Transpiration Flux From Veg': 'Tveg_tavg',
        'Wind Speed': 'Wind_f_inst',
        # 'Latitude': 'lat',
        # 'Longitude': 'lon',
        # 'Time': 'time',
        }


def timecoverage():
    """
    Time intervals of GLDAS data
    """
    return [
        ('All Available Times', 'alltimes'),
        (2019, 2019),
        (2018, 2018),
        (2017, 2017),
        (2016, 2016),
        (2015, 2015),
        (2014, 2014),
        (2013, 2013),
        (2012, 2012),
        (2011, 2011),
        (2010, 2010),
        (2009, 2009),
        (2008, 2008),
        (2007, 2007),
        (2006, 2006),
        (2005, 2005),
        (2004, 2004),
        (2003, 2003),
        (2002, 2002),
        (2001, 2001),
        (2000, 2000),
    ]


def wms_colors():
    """
    Color options usable by thredds wms
    """
    return [
        ('SST-36', 'sst_36'),
        ('Greyscale', 'greyscale'),
        ('Rainbow', 'rainbow'),
        ('OCCAM', 'occam'),
        ('OCCAM Pastel', 'occam_pastel-30'),
        ('Red-Blue', 'redblue'),
        ('NetCDF Viewer', 'ncview'),
        ('ALG', 'alg'),
        ('ALG 2', 'alg2'),
        ('Ferret', 'ferret'),
        # ('Probability', 'prob'),
        # ('White-Blue', whiteblue'),
        # ('Grace', 'grace'),
        ]


def geojson_colors():
    return [
        ('White', '#ffffff'),
        ('Red', '#ff0000'),
        ('Green', '#00ff00'),
        ('Blue', '#0000ff'),
        ('Black', '#000000'),
        ('Pink', '#ff69b4'),
        ('Orange', '#ffa500'),
        ('Teal', '#008080'),
        ('Purple', '#800080'),
    ]


def get_charttypes():
    return [
        ('Full Timeseries (Single-Line Plot)', 'timeseries'),
        ('Monthly Analysis (Box Plot)', 'monthbox'),
        ('Monthly Analysis (Multi-Line Plot)', 'monthmulti'),
        ('Yearly Analysis (Box Plot)', 'yearbox'),
        ('Yearly Analysis (Multi-Line Plot)', 'yearmulti'),
    ]
