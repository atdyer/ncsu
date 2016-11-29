import numpy as np
from fe import solve_fe
from scipy.integrate import quadrature as integrate

outfile = '../data/part_2_errors.csv'

nel = [ i for i in range( 2, 33 ) ]
nen = [ i for i in range( 2, 5 )]

with open( outfile, 'w' ) as f:

    f.write( 'num_elements,num_element_nodes,h,error_l2,error_energy\n')

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

            ### Exact solution as a function
            def exact ( _xe ):
                return 10 + 100*_xe - 100*pow( _xe, 3)/6.0

            def dexact ( _xe ):
                return 100 - 50 * pow( _xe, 2 )

            xe = [ float(i) * ( l / ( 250 - 1 ) ) for i in range( 250 ) ]
            ye = [ exact( _x ) for _x in xe ]

            ### Calculate errors
            def IEN ( element_number, local_node_number ):
                    return ( num_element_nodes - 1 ) * element_number + local_node_number

            error_l2 = 0
            error_energy = 0
            for i in range( len( d ) - 1 ):

                xcoords = [ x[i], x[i+1] ]
                uvals = [ d[i], d[i+1] ]
                slope = (uvals[1]-uvals[0]) / (xcoords[1]-xcoords[0])

                def error_function_l2 ( xval ):
                    return np.interp( xval, xcoords, uvals ) - exact( xval )

                def error_function_energy ( xval ):
                    return A * k * pow( dexact( xval ) - slope, 2 )

                error_l2 += pow(integrate(error_function_l2, xcoords[0], xcoords[1])[0], 2)
                error_energy += 0.5 * integrate( error_function_energy, xcoords[0], xcoords[1] )[0]


            h = x[_nen-1]-x[0]
            error_l2 = np.sqrt(error_l2)
            error_energy = np.sqrt(error_energy)

            f.write( '{:d},{:d},{:f},{:f},{:f}\n'.format( _nel, _nen, h, error_l2, error_energy))
