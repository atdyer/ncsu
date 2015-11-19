import sys
import os
import urllib

# Downloads required .las files to the given directory
def download_data( directory ):

    if os.path.exists( directory ):

        base_url = 'http://fatra.cnr.ncsu.edu/lidar/'
        files = [ '0791_005.las',
                  '0791_011.las',
                  '0792_017.las',
                  '0782_020.las',
                  '0781_008.las' ]

        for f in files:

            print "Retrieving " + f
            urllib.urlretrieve( base_url + f, directory + os.path.sep + f )

    else:

        print "Invalid path."

# If running this script from the command-line, pass in a directory
# as an argument to download the required .las files to that directory
if __name__ == "__main__":

    if len( sys.argv ) == 2:

        download_data( sys.argv[1] )

    else:

        print "Usage: python download_data.py [path to save directory]"
