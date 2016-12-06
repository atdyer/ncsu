from shape_functions import shape_functions

with open( '../data/shape_functions.csv', 'w' ) as f:

    f.write( 'nen,n,x,y\n')

    for nen in range( 2, 5 ):

        N, dN, xi = shape_functions( nen )

        for n in range( len( N ) ):

            func = N[n]
            npoints = 250

            for x in [-1 + i * 2. / (npoints - 1) for i in range(npoints)]:

                f.write( '{:d},{:d},{:f},{:f}\n'.format( nen, n, x, func(x) ) )