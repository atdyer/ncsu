# GRASS imports
import grass.script as gscript
from grass.pygrass.modules.grid import GridModule

# Generate an interpolated DSM from a vector
# - vector_name: name of the vector in the current mapset
# - lidar_dsm (optional): name to give the resulting DSM
# - parallel (optional): Whether or not to run in parallel
def interpolate_dsm( vector_name, lidar_dsm = 'elevation_dsm', parallel = False ):

    # Get the current region
    region = gscript.region()

    # Calculate the width and height required to divide the region
    # into four equal sized tiles
    width = region['cols'] / 2 + 1
    height = region['rows'] / 2 + 1

    # Create the GridModule
    grid = GridModule( 'v.surf.rst',
        debug=parallel==False, width=width, height=height,
        overlap=10, processes=4, npmin=100,
        input=vector_name, elevation=lidar_dsm,
        tension=30, smooth=1, overwrite=True
    )

    # Run the GridModule
    grid.run()

    # Return the name of the new DSM
    return lidar_dsm
