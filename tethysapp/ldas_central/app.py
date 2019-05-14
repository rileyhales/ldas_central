from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.app_settings import CustomSetting


class LdasCentral(TethysAppBase):
    """
    Tethys app class for LDAS Data Visualizer   Central America.
    """
    name = 'LDAS Data Visualizer - Central America'
    index = 'ldas_central:home'
    icon = 'ldas_central/images/logo2.jpg'
    package = 'ldas_central'
    root_url = 'ldas-central'
    color = '#8e44ad'
    description = 'An LDAS tool built from the GLDAS data visualizer'
    tags = ''
    enable_feedback = False
    feedback_emails = []
    version = 'Version 1.0.1 - 14 May 2019'

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='ldas-central',
                controller='ldas_central.controllers.home'
            ),
            # url maps for ajax calls
            UrlMap(
                name='getPointSeries',
                url='ldas-central/ajax/getPointSeries',
                controller='ldas_central.ajax.get_pointseries',
            ),
            UrlMap(
                name='getPolygonAverage',
                url='ldas-central/ajax/getPolygonAverage',
                controller='ldas_central.ajax.get_polygonaverage',
            ),
            UrlMap(
                name='getShapeAverage',
                url='ldas-central/ajax/getShapeAverage',
                controller='ldas_central.ajax.get_shapeaverage',
            ),
            UrlMap(
                name='getBounds',
                url='ldas-central/ajax/getBounds',
                controller='ldas_central.ajax.get_bounds',
            ),
            UrlMap(
                name='customsettings',
                url='ldas-central/ajax/customsettings',
                controller='ldas_central.ajax.customsettings'
            ),
        )

        return url_maps

    def custom_settings(self):
        CustomSettings = (
            CustomSetting(
                name='Local Thredds Folder Path',
                type=CustomSetting.TYPE_STRING,
                description="Local file path to datasets (same as used by Thredds) (e.g. /home/thredds/myDataFolder/)",
                required=True,
            ),
            CustomSetting(
                name='Thredds WMS URL',
                type=CustomSetting.TYPE_STRING,
                description="URL to the GLDAS folder on the thredds server (e.g. http://[host]/thredds/ldas_central/)",
                required=True,
            ),
            CustomSetting(
                name='Geoserver Workspace URL',
                type=CustomSetting.TYPE_STRING,
                description="URL (wms) of the workspace on geoserver (e.g. https://[host]/geoserver/ldas_central/wms)",
                required=True,
            ),
        )
        return CustomSettings