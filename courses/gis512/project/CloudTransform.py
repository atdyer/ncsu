import math
import numpy as np

class CloudTransform:

    # Optionally pass in the rotation matrix to go from LIDAR
    # scanner's own coordinate system (SOCS) to FRF coordinates.
    # If no rotation matrix is passed in, a default will be used
    def __init__( self, lidar_to_frf_matrix = None ):

        # Get LIDAR transformation matrix (to FRF coordinates)
        if lidar_to_frf_matrix is None:

            self.lidar_to_frf_matrix = np.array(
                [[-0.425003074, -0.033113506,  0.904586028,  47.858215666],
                 [ 0.012494439, -0.999450062, -0.030715841,  945.34381353],
                 [ 0.905105671, -0.001752032,  0.425183084,  13.816313519],
                 [ 0,            0,            0,            1]]
            )

        else:

            self.lidar_to_frf_matrix = np.array( lidar_to_frf_matrix )

        # NC State Plane parameters
        self.ncspm_easting_origin = 901951.6805
        self.ncspm_northing_origin = 274093.1562
        self.ncspm_angle = np.radians( 90 - 69.974707831 )

    # Convert from FRF coordinates to NC State Plane (m)
    def frf_to_ncspm( self, cloud ):

        # Print status message
        print 'Converting cloud from FRF coordinates to NC State Plane (m)'

        # Only working with x- and y-coordinates
        x = cloud[:,0]
        y = cloud[:,1]

        # Perform rotation
        h = np.hypot( x, y )
        angle = np.arctan2( x, y ) - self.ncspm_angle
        north = self.ncspm_northing_origin + np.multiply( h, np.cos( angle ) )
        east = self.ncspm_easting_origin + np.multiply( h, np.sin( angle ) )

        # Reassemble the points as x,y,z
        return np.vstack( ( east, north, cloud[:,2] ) ).T

    # Convert from LIDAR SOCS to FRF coordinates
    def lidar_to_frf( self, cloud ):

        # Print status message
        print 'Converting cloud from LIDAR SOCS to FRF coordinates'

        # Add a column of ones
        ones = np.ones( ( len(cloud), 1 ) )

        frfcloud = np.concatenate( (cloud, ones), axis = 1)

        # Apply rotation matrix
        frfcloud = np.dot( self.lidar_to_frf_matrix, frfcloud.T )

        # Return only x,y,z points
        return frfcloud.T[:,:3]
