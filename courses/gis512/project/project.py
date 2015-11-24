from ClassifiedRaster import *
from CloudFilters import *
from CloudTransform import *
from CloudUtilities import *

import matplotlib.pyplot as plt

# Path to data files
tiffilepath = '/home/tristan/box/courses/gis-512/project/duck-vegetation-ncspm.tif'
cloudfiles = ['/home/tristan/Desktop/data/north.bin',
              '/home/tristan/Desktop/data/east.bin',
              '/home/tristan/Desktop/data/south.bin']
outfile = '/home/tristan/Desktop/data/classified_invert_notraining.csv'


# Open the classified raster
raster = ClassifiedRaster( tiffilepath )

# Create cloud tools
utilities = CloudUtilities()
coordinates = CloudTransform()

# List of final clouds
finalclouds = []

# Loop through point clouds
for cloudfile in cloudfiles:

    # Read the point cloud
    cloudraw = utilities.open_binary( cloudfile, 4 )
    cloud = cloudraw[:,:3]
    faces = cloudraw[:,3]

    # Extract scanlines
    scanlines = utilities.get_scanlines( faces )

    # Load classified spm from binary file
    cloudspm = np.load( binfile )
    classification = cloudspm[:,3]
    cloudspm = cloudspm[:,:3]

    # Transform coordinates
    cloudfrf = coordinates.lidar_to_frf( cloud )
    cloudspm = coordinates.frf_to_ncspm( cloudfrf )

    # Classify
    classification = raster.get_classification( cloudspm )

    # Trained classification
    filt = LinescanFilter( cloudspm )
    classification = filt.trained_classification( scanlines, classification, False )

    # Keep filtered cloud
    finalcloud = np.concatenate( (cloudspm, classification[:,None]), axis = 1 )
    finalclouds.append( finalcloud )

# Save the results
utilities.save_cloud_csv( finalclouds, outfile )
