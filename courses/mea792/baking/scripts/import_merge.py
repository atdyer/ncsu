# Python imports
import glob
import os

# GRASS imports
import grass.script as gscript
from grass.pygrass.modules.grid import GridModule

# Script imports
from download_data import *
from transform_coordinates import *
from las_to_vector import *

def import_merge( workingDir, merged_las_vector = 'merged_points' ):

    # Make sure the working directory exists
    if not os.path.exists( workingDir ):

        os.mkdir( workingDir )

    # Move to the working directory
    os.chdir( workingDir )

    # Check for required las files
    if len( glob.glob( '*.las' ) ) == 0:
        download_data( './' )
        for f in glob.glob( '*.las' ):
            transform_coordinates( f )

    # Set the region
    gscript.run_command( 'g.region',
        n=219637,
        s=219254,
        w=636730,
        e=637193,
        res=1,
        flags='p')

    # Import transformed las files into single vector
    lasfiles = glob.glob( '*_spm.las' )
    las_to_vector( lasfiles, merged_las_vector)

    # Return the name of the merged DEM
    return merged_las_vector
