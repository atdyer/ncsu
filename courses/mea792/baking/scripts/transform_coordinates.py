import os
from subprocess import call

# Transforms .las file coordinates from EPSG:2264 to EPSG:3358
# using las2las and saves new file with _spm suffix
def transform_coordinates( lasfile ):

    # Check that file exists and is a .las file
    if os.path.isfile( lasfile ) and lasfile.endswith( '.las' ):

        # Split filename and extension
        name, ext = os.path.splitext( lasfile )

        print "Transforming coordinates: " + lasfile

        # Call las2las
        call( ['las2las',
               '--a_srs=EPSG:2264', '--t_srs=EPSG:3358',
               '-i', lasfile,
               '-o', name + '_spm' + ext ] )

# If running this script from the command-line, pass in a list of
# files to transform to NCSP
if __name__ == "__main__":

    if len( sys.argv ) > 1:

        for f in sys.argv:

            transform_coordinates( f )

    else:

        print "Usage: python download_data.py [path to save directory]"
