import os
import grass.script as gscript
import matplotlib.pyplot as plt
import numpy as np

# Plots terrain profiles in each raster and optionally generates
# statistics reports for each profile.
# - rasters: list of rasters to use for each profile
# - coordinates_lists: list of lists of coordinates along which profiles are drawn
# - stat_files: list of file names for stat files (one for each coordinate list)
def terrain_profiles( rasters, coordinates_lists, stat_files = [] ):

    # Loop through each list of coordinates
    for c in range( len( coordinates_lists ) ):

        # The current list of coordinates
        coordinates = coordinates_lists[c]

        # Create a dictionary that will store this profile of each raster
        profiles = {}

        # Loop through the rasters
        for raster in rasters:

            # Get the profile
            profile = gscript.read_command('r.profile', input=raster,
                                            coordinates=coordinates,
                                            quiet=True).strip()

            distance = []
            elevation = []

            # Parse profile data
            for line in profile.splitlines():
                dat = line.split()
                if dat[-1] != '*':
                    distance.append( float( dat[0] ) )
                    elevation.append( float( dat[-1] ) )

            # Save the profile in the dictionary
            profiles[raster] = (distance, elevation)

        # Is there a filename provided for the current coordinate list?
        if c < len( stat_files ):

            # Open the file for writing
            with open( stat_files[c], 'w' ) as f:

                # Write the header line
                f.write(','.join(['name', 'minim', 'maxim', 'mean',
                                  'stddev', 'median', 'roughness']))
                f.write('\n')

                # Create a dictionary to hold the stats
                stats = {}

                # Calculate statistics for each raster profile
                for raster in profiles:

                    profile = np.array( profiles[raster][1] )
                    maxim = np.max( profile )
                    minim = np.min( profile )
                    mean = np.mean( profile )
                    stddev = np.std( profile )
                    median = np.median( profile )
                    roughness = np.std( np.diff( profile ) )
                    stats[raster] = ( minim, maxim, mean, stddev, median, roughness )

                    # Write the statistics to the file
                    f.write(raster + ',')
                    f.write(','.join([str(i) for i in stats[raster]]))
                    f.write('\n')

        # Add each profile to the plot
        for raster in profiles:

            plt.plot( profiles[raster][0], profiles[raster][1], label=raster )
            plt.legend( loc=0 )

        # Show the plot
        plt.show()
