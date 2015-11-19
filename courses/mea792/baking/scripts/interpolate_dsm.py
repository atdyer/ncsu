# GRASS imports
import grass.script as gscript
from grass.pygrass.modules.grid import GridModule

def interpolate_dsm( vector_name, lidar_dem = 'elevation_dem', parallel = False ):

    # DSM interpolation
    region = gscript.region()
    width = region['cols'] / 2 + 1
    height = region['rows'] / 2 + 1

    grid = GridModule( 'v.surf.rst',
        debug=parallel==False, width=width, height=height,
        overlap=10, processes=4, npmin=100,
        input=vector_name, elevation=lidar_dem,
        tension=30, smooth=1, overwrite=True
    )

    grid.run()
