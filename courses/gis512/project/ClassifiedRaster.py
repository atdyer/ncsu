import gdal
import osr
import sys
import math

from coordinate_transformations import *
from read_points import *

# Let gdal throw python exceptions
gdal.UseExceptions()

class ClassifiedRaster:

    # Filter must be initialized with a classified
    # raster file (geotiff). In the raster, vegetation must
    # be colored green (0, 255, 0, 255) and ground must
    # be colored white (255, 255, 255, 255). Everything else
    # will be considered off map (and no weighting will be
    # applied)
    def __init__( self, classified_raster ):

        try:

            self.tif = gdal.Open( classified_raster )
            self.raster = self.tif.GetRasterBand( 1 )
            self.data = self.raster.ReadAsArray()
            self.geo_transform = self.tif.GetGeoTransform()
            self.transform = None

            print '\nFilter initialized with raster:', classified_raster
            print 'Raster size: ', self.data.shape

            color_table = self.raster.GetColorTable()
            ground = []
            veg = []

            for i in range( color_table.GetCount() ):

                entry = color_table.GetColorEntry( i )

                if entry == ( 0, 255, 0, 255 ):
                    veg.append( i )

                elif entry == ( 255, 255, 255, 255 ):
                    ground.append( i )

            self.ground_values = set( ground )
            self.vegetation_values = set( veg )

        except RuntimeError, e:

            print 'Unable to open raster file:', classified_raster
            print e
            sys.exit( 1 )

    def set_transform( self, source, target ):

        self.transform = osr.CoordinateTransformation( source, target )

    def get_class( self, x, y ):

        pixel, line = self.get_pixel( x, y )

        if line >= self.data.shape[0] or pixel >= self.data.shape[1]:
            return 0

        value = self.data[ line, pixel ]

        if value in self.ground_values:
            return 1
        elif value in self.vegetation_values:
            return 2
        return 0

    def get_pixel( self, x, y ):

        if self.transform:
            x, y, z = self.transform.TransformPoint( x, y )

        ulX = self.geo_transform[0]
        ulY = self.geo_transform[3]
        xDist = self.geo_transform[1]
        yDist = self.geo_transform[5]
        rtnX = self.geo_transform[2]
        rtnY = self.geo_transform[4]
        pixel = int((x - ulX) / xDist)
        line = int((ulY - y) / xDist)

        return (pixel, line)

    def get_classification( self, cloud ):

        # Print status
        print "Retrieving point classifications from raster classifications"

        classification = np.empty([cloud.shape[0], 1])

        for i, point in enumerate( cloud ):

            classification[i] = self.get_class( point[0], point[1] )

        return classification
