import numpy as np

class CloudUtilities:

    # Gets scanlines based on facet number
    def get_scanlines( self, facets ):

        # Print status
        print 'Extracting scanlines'
        indices = [0]
        current_facet = facets[0]

        # When subsequent point is on a different facet,
        # then we've moved on to the next scanline
        for i in range( len(facets) ):

            if facets[i] != current_facet:

                indices.append(i)
                current_facet = facets[i]

        # Print status
        print '\tFound', len( indices ), 'scanlines'

        # Return scanline indices
        return indices


    # Opens a binary file in which every value
    # is a 64-bit float. ndims is the number of
    # floating point values per point
    def open_binary( self, binary_file, ndims ):

        # Print status
        print 'Opening file', binary_file

        # Read data
        data = np.fromfile( binary_file, dtype=np.float64 )

        # Print number of points found
        print '\tFound', len( data ) / ndims, 'points'

        # Reshape into matrix and return data
        return data.reshape( len( data ) / ndims, ndims)


    def save_cloud_npy( self, cloud, filename ):

        # Print status
        print 'Saving point cloud to', filename

        # Save the file
        np.save( filename, cloud )

    # Saves a cloud or list of clouds into a single
    # csv file. If multiple clouds are provided, only
    # the point dimensions that they all have in common
    # will be written to the file (max 10 dimensions)
    def save_cloud_csv( self, cloud, filename ):

        # If a single cloud is passed, put it in a list
        if not isinstance( cloud, (list, tuple) ):

            cloud = [cloud]

        # Print status
        print 'Writing', len(cloud), 'point clouds to file', filename

        # Open the file
        with open( filename, 'w' ) as f:

            # Get the minimum point dimensions
            mindims = cloud[0].shape[1]
            for c in cloud:
                dim = c.shape[1]
                if dim < mindims and dim > 0:
                    mindims = dim

            # Max 10 dimensions
            if mindims > 10:
                mindims = 10
            dims = 'xyzabcdefg'
            if mindims == 0:
                print '\tNo points to write'
                return

            # Write the file header and build the line template
            template = ''
            for d in range( mindims-1 ):
                f.write( dims[d] + ',')
                template += '{' + str(d) + '},'
            f.write( dims[mindims-1] + '\n' )
            template += '{' + str(mindims-1) + '}\n'

            # Write data
            for c in cloud:

                for point in c:

                    f.write( template.format( *point[:mindims].tolist() ) )
