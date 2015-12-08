import numpy as np

class LinescanFilter:

    def __init__( self, cloud ):

        self.cloud = cloud
        self.z = cloud[:,2]
        self.stencil_size = 10

        # Number of times a raster-ground point needs to be classified as ground
        # to be considered a ground point
        self.ground_pass = 2

        # Number of times a raster-veg point needs to be classified as ground
        # to be considered a ground point
        self.veg_pass = 8

        # Number of times a raster-unclass point needs to be classified as ground
        # to be considered a ground point
        self.default_pass = 5

    def confidence( self, noise ):

        return int( abs( noise ) * self.stencil_size )

    def trained_classification( self, scandices, training, use_training=True ):

        # Variables
        numpoints = len( training )
        numscans = len( scandices )

        # Print status message
        print 'Starting trained classification'
        print '\t', numpoints, 'points in', numscans, 'line scans'

        # Start progress bar
        self.set_progress_parameters( numscans )

        # Create classification arrays
        nground = np.zeros_like( training )
        classification = np.ones_like( training )

        # Loop through scans
        for s, scan in enumerate( scandices ):

            # print 'Classifying scan', s+1
            self.set_current_progress( s )

            # The index at which the line scan starts
            start = scan

            # The index at which the next line scan starts
            end = scandices[s+1] if s&lt;len(scandices)-1 else len(training)

            # If the scan has fewer than stencil_size points, they're probably
            # all bad points, so let's ignore them
            if end-start &lt; self.stencil_size:
                continue

            # Create the stencil
            stencil = np.array( self.z[start:start+self.stencil_size] )

            # Loop through current scan
            for i in range( start, end-self.stencil_size):

                # Refill the stencil
                stencil[:] = self.z[i:i+self.stencil_size]

                # Calculate sum of absolute differences
                diffsums = np.sum( np.abs( np.diff( stencil ) ) )

                # Calculate difference between two ends of the stencil
                diffends = stencil[self.stencil_size-1] - stencil[0]

                # Calculate noise level
                noise = diffends / diffsums

                # Get number to set as ground points based on confidence
                nkeep = self.confidence( noise )

                # Classify the lowest nkeep values as ground
                keep_indices = stencil.argsort()[:nkeep] + i

                nground[ keep_indices ] += 1

            if use_training:

                # Loop through classification results and determine
                # final classification based on raster data
                for i in range( start, end ):

                    raster_class = training[i]
                    ground_count = nground[i]

                    if raster_class == 0 and ground_count &lt; self.default_pass:
                        classification[i] = 0
                    elif raster_class == 1 and ground_count &lt; self.ground_pass:
                        classification[i] = 0
                    elif raster_class == 2 and ground_count &lt; self.veg_pass:
                        classification[i] = 0

            else:

                for i in range( start, end ):

                    if nground[i] &lt; self.default_pass:
                        classification[i] = 0

        # Finish the load bar
        self.set_progress_finished()

        # Return classifications
        return classification