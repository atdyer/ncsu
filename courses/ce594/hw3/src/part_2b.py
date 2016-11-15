import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import quadrature as integrate

# Constants
A = 0.1
k = 0.5
l = 1.0

# Mesh
num_elements = 10
num_element_nodes = 3
num_nodes = num_elements * ( num_element_nodes - 1 ) + 1
x_coord = [ float(i) * ( l / ( num_nodes - 1 ) ) for i in range( num_nodes ) ]



# Boundary conditions
bc_essential = dict()
bc_essential[ 0 ] = 0
# bc_essential[ num_nodes - 1 ] = 0

bc_natural = dict()
bc_natural[ num_nodes - 1 ] = -1


# Source terms
def s ( x ):
    return 5*x


# Shape functions (in -1 to 1 coordinate system)
def N1 ( xi ):
    return ( xi / 2.0 ) * ( xi - 1 )

def N2 ( xi ):
    return 1 - pow( xi, 2 )

def N3 ( xi ):
    return ( xi / 2.0 ) * ( xi + 1 )


def dN1 ( xi ):
    return xi - 0.5

def dN2 ( xi ):
    return -2 * xi

def dN3 ( xi ):
    return xi + 0.5

def jacobian ( xl, xr ):
    return 0.5 * ( xr - xl )

N = [ N1, N2, N3 ]
dN = [ dN1, dN2, dN3 ]


# IEN
def IEN ( element_number, local_node_number ):

    return ( num_element_nodes - 1 ) * element_number + local_node_number

def ID ( global_node_number ):

    return global_node_number


# Global arrays
num_dofs = num_nodes # - len( bc_essential )
K = np.zeros( ( num_dofs, num_dofs ) )
F = np.zeros( ( num_dofs, 1 ) )

# Element loop
for element in range( num_elements ):

    # Create local matrices
    ke = np.zeros( ( num_element_nodes, num_element_nodes ) )
    fe = np.zeros( ( num_element_nodes, 1 ) )

    # Get local coordinates
    global_nodes = [ IEN( element, i ) for i in range( num_element_nodes ) ]
    x_values = [ x_coord[ node ] for node in global_nodes ]
    xi = [ -1, 0, 1 ]

    J = jacobian( x_values[0], x_values[ len( x_values ) - 1 ] )

    # Node loop
    for row in range( num_element_nodes ):

        # Get the source term at the node's x-location
        s_node = s( x_values[ row ] )

        # Create the function we'll be integrating
        def f ( xi ):
            return N[ row ]( xi ) * s_node

        # Perform integration over element domain
        val, err = integrate( f, xi[0], xi[len(xi)-1] )

        # Add contribution, converting to local coordinates
        fe[ row, 0 ] = val * J

        # Check for natural boundary condition contribution
        if global_nodes[ row ] in bc_natural:

            fe[ row, 0 ] += N[ row ]( xi[ row ] ) * bc_natural[ global_nodes[ row ] ]

        for col in range( num_element_nodes ):

            # Define function we'll be integrating
            def f ( xi ):
                return ( dN[row]( xi ) / J ) * ( dN[col]( xi ) / J )

            # Integrate over element domain
            val, err = integrate( f, xi[0], xi[len(xi)-1] )

            # Add contribution, converting to local coordinates
            ke[ row, col ] = val * A * k * J


    # Update globals with contributions from local
    for row in range( num_element_nodes ):

        row_node = IEN( element, row )
        r = ID( row_node )

        F[ r, 0 ] += fe[ row, 0 ]

        for col in range( num_element_nodes ):

            col_node = IEN( element, col )
            c = ID( col_node )

            K[ r, c ] += ke[ row, col ]


# Essential boundary conditions
k_mask = np.ones( K.shape, dtype=bool )
f_mask = np.ones( F.shape, dtype=bool )
dof = num_nodes - len( bc_essential )
for node, value in bc_essential.iteritems():

    # Eliminate from K matrix
    k_mask[node,:] = False
    k_mask[:,node] = False
    f_mask[node,:] = False

    # Subtract from F vector
    for row in range( num_nodes ):

        _k = K[ row, node ]
        F[ row, 0 ] -= _k * value

K = np.reshape( K[k_mask], ( dof, dof ) )
F = np.reshape( F[f_mask], ( dof, 1 ) )


# Solve
d = np.linalg.solve( K, F )


# Plot
x = x_coord
y = d[:,0].tolist()

for node, value in bc_essential.iteritems():

    y.insert( node, value )

plt.plot( x, y )
plt.show()


# Print values
# print K
# print F
# print y