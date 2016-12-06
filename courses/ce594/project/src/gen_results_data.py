from fe import solve_fe

with open( '../data/solution.csv', 'w' ) as f:

    f.write( 'num_element_nodes,num_elements,x,y\n')

    for _nen in range( 2, 10 ):

        for _ne in range( 1, 9 ):

            ### Constants
            A = 2.0
            k = 250.0
            l = 10.0
            alpha = -5.0

            ### Mesh
            num_elements = _ne
            num_element_nodes = _nen
            num_nodes = num_elements * ( num_element_nodes - 1 ) + 1

            ### Boundary conditions
            # Essential
            bc_essential = dict()
            bc_essential[ num_nodes - 1 ] = 3.0

            # Natural
            bc_natural = dict()
            bc_natural[ 0 ] = -0.2

            ### Solve
            d, x = solve_fe( A, k, l, alpha, num_elements, num_element_nodes, bc_essential, bc_natural )

            ### Write results to file
            for i in range( len( x ) ):
                f.write( '{:d},{:d},{:f},{:f}\n'.format( _nen, _ne, x[i], d[i] ) )