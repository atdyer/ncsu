from fe import solve_fe

outfile = '../data/part_2_elements.csv'

nel = [ 2, 3, 4, 5, 6, 7, 8 ]
nen = [ 2, 3 ]

with open( outfile, 'w' ) as f:

    f.write( 'num_elements,num_element_nodes,x,y\n')

    for _nen in nen:

        for _nel in nel:

            print 'Running FE analysis with', _nel, 'elements and', _nen, 'element nodes'

            ### Constants
            A = 0.1
            k = 0.5
            l = 1.0

            ### Mesh
            num_elements = _nel
            num_element_nodes = _nen
            num_nodes = num_elements * ( num_element_nodes - 1 ) + 1

            ### Boundary conditions
            # Essential
            bc_essential = dict()
            bc_essential[ 0 ] = 10

            # Natural
            bc_natural = dict()
            bc_natural[ num_nodes - 1 ] = 25/k

            ### Source terms
            s = lambda _x: 5 * _x

            ### Solve
            d, x = solve_fe( A, k, l, num_elements, num_element_nodes, s, bc_essential, bc_natural )

            ### Save x,y data
            for i in range( len( x ) ):
                f.write( '{:d},{:d},{:f},{:f}\n'.format( _nel, _nen, x[i], d[i] ))
