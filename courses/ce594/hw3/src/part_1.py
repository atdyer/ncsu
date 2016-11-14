import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quadrature as integrate

# Constants
A = 0.1
k = 0.5

# Mesh
num_elements = 10
num_element_nodes = 2
num_nodes = num_elements * ( num_element_nodes - 1 ) + 1
x_coord = [ float(i)/num_elements for i in range(num_nodes) ]



# Boundary conditions
bc_essential = dict()
# bc_essential[ 0 ] = 0
bc_essential[ num_nodes-1 ] = 0

bc_natural = dict()
# bc_natural[ num_nodes - 1 ] = 0
bc_natural[ 0 ] = 0


# Source terms
def s ( x ):
    return 5


# Shape functions (in -1 to 1 coordinate system)
def N1 ( xi ):
    return 0.5 * ( 1 - xi )

def N2 ( xi ):
    return 0.5 * ( xi + 1 )

def dN1 ( xi ):
    return -0.5

def dN2 ( xi ):
    return 0.5

def jacobian ( xl, xr ):
    return 0.5 * ( xr - xl )

N = [ N1, N2 ]
dN = [ dN1, dN2 ]


# IEN
def IEN ( element_number, local_node_number ):

    return ( num_element_nodes - 1 ) * element_number + local_node_number

def ID ( global_node_number ):

    if global_node_number in bc_essential:
        return -1

    if 0 in bc_essential:
        return global_node_number - 1

    return global_node_number


# Global arrays
num_dofs = num_nodes - len( bc_essential )
K = np.zeros( ( num_dofs, num_dofs ) )
F = np.zeros( ( num_dofs, 1 ) )

# Element loop
for element in range( num_elements ):

    print "Starting element loop on element", element

    # Create local matrices
    ke = np.zeros( ( num_element_nodes, num_element_nodes ) )
    fe = np.zeros( ( num_element_nodes, 1 ) )

    print "\tInitialized Local Matrices:"

    # Get local coordinates
    global_node_left = IEN( element, 0 )
    global_node_right = IEN( element, 1 )
    x_left = x_coord[ global_node_left ]
    x_right = x_coord[ global_node_right ]
    nodes = [ global_node_left, global_node_right ]
    x = [ x_left, x_right ]
    xi = [ -1, 1 ]

    print "\tElement coordinates:", x_left, x_right

    J = jacobian( x_left, x_right )

    # Node loop
    for row in range( num_element_nodes ):

        # Get the source term at the node's x-location
        s_node = s( x[ row ] )

        # Create the function we'll be integrating
        def f ( xi ):
            return N[row]( xi ) * s_node

        # Perform integration over element domain
        val, err = integrate( f, xi[0], xi[1] )

        # Add contribution, converting to local coordinates
        fe[ row, 0 ] = val * J

        # Check for essential boundary condition contribution
        if nodes[ row ] in bc_essential:

            fe[ row, 0 ] -= bc_essential[ nodes[ row ] ]

        # # Check for natural boundary condition contribution
        # if nodes[ row ] in bc_natural:
        #
        #     fe[ row, 0 ] += N[ row ]( x[ row ] ) * bc_natural[ nodes[ row ] ]


        for col in range( num_element_nodes ):

            def f ( xi ):
                return ( dN[row]( xi ) / J ) * ( dN[col]( xi ) / J )

            val, err = integrate( f, xi[0], xi[1] )
            ke[ row, col ] = val * A * k * J

            # Check for essential boundary condition contribution
            if nodes[ row ] in bc_essential:

                ke[ row, col ] -= val * bc_essential[ nodes[ row ] ]

        # Check for essential boundary condition contribution
        if nodes[ row ] in bc_essential:

            print 'essential at row', nodes[row]
            fe[ row, 0 ] -= ke[ row, 1 ] * bc_essential[ nodes[ row ] ]

    # Update globals with contributions from local
    for row in range( num_element_nodes ):

        row_node = IEN( element, row )
        r = ID( row_node )

        if r != -1:

            F[ r, 0 ] += fe[ row, 0 ]

            for col in range( num_element_nodes ):

                col_node = IEN( element, col )
                c = ID( col_node )

                if c != -1:

                    K[ r, c ] += ke[ row, col ]

d = np.linalg.solve( K, F )

x = x_coord
y = d[:,0].tolist()
#
for node, value in bc_essential.iteritems():

    y.insert( node, value )
#
plt.plot( x, y )
plt.show()
# print K
# print F