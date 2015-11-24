import numpy as np
import sys

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

    def set_progress_parameters( self, progressend ):

        # Load bar Variables
        charwidth = 150
        self.nextchar = progressend / charwidth

        # Start load bar
        print '\tProcessing', '[', ' '*charwidth, ']',
        print '\b'*(charwidth+2),
        sys.stdout.flush()

    def set_current_progress( self, progresscurrent ):

        if progresscurrent % self.nextchar == 0:

            print '\b#',
            sys.stdout.flush()

    def set_progress_finished( self ):

        print ']'
        sys.stdout.flush()

    def confidence( self, noise ):

        return int( abs( noise ) * self.stencil_size )

    # 0 = unclassified
    # 1 = ground
    # 2 = vegetation
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
            end = scandices[s+1] if s<len(scandices)-1 else len(training)

            # If the scan has fewer than stencil_size points, they're probably
            # all bad points, so let's ignore them
            if end-start < self.stencil_size:
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

                    if raster_class == 0 and ground_count < self.default_pass:
                        classification[i] = 0
                    elif raster_class == 1 and ground_count < self.ground_pass:
                        classification[i] = 0
                    elif raster_class == 2 and ground_count < self.veg_pass:
                        classification[i] = 0

            else:

                for i in range( start, end ):

                    if nground[i] < self.default_pass:
                        classification[i] = 0

        # Finish the load bar
        self.set_progress_finished()

        # Return classifications
        return classification



class PassThroughFilter:

    def __init__( self, cloud ):

        self.cloud = cloud
        self.x = cloud[:,0]
        self.y = cloud[:,1]
        self.z = cloud[:,2]
        self.mask = np.ones( self.x.shape, dtype=bool )
        print '\tCreated mask of size', self.mask.shape

    def execute( self ):

        print '\tApplying all passthrough masks'

        xfilt = self.x[self.mask].T
        yfilt = self.y[self.mask].T
        zfilt = self.z[self.mask].T

        print '\t{0}/{1} points kept'.format(np.sum(self.mask == True), len(self.x))

        return np.vstack((xfilt, yfilt, zfilt)).T

    def get_mask( self ):

        return self.mask

    def include_range( self, axis, lower_bound, upper_bound ):

        vals = None

        if axis == 'x':

            print '\tMasking points with x outside of range [{0}, {1}]'.format(lower_bound, upper_bound)
            self.mask = self.mask & (self.x >= lower_bound) & (self.x <= upper_bound)

        elif axis == 'y':

            print '\tMasking points with y outside of range [{0}, {1}]'.format(lower_bound, upper_bound)
            self.mask = self.mask & (self.y >= lower_bound) & (self.y <= upper_bound)

        elif axis == 'z':

            print '\tMasking points with z outside of range [{0}, {1}]'.format(lower_bound, upper_bound)
            self.mask = self.mask & (self.z >= lower_bound) & (self.z <= upper_bound)
