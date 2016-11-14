import numpy as np
import matplotlib.pyplot as plt

# Mesh
num_elements = 8
num_element_nodes = 2
num_nodes = num_elements * ( num_element_nodes - 1 ) + 1
x_coord = [ float(i)/num_elements for i in range(num_nodes) ]

# Use functions for b.c.'s to make things a little quicker
def h ( el, el_node ):
    if el == num_elements-1 and el_node == 1:
        return 25
    return 0

def u ( el, el_node ):
    if el == 0 and el_node == 0:
        return 10
    return 0

# Inputs
area = 0.1
k = 0.5
def s ( _x ):
    return 5 #*_x

# Integration
num_int_points = 1
x_int = 1
w_int = 2

Ntilde = [ 0.5, 0.5 ]
dNtilde = [ -0.5, 0.5 ]

# Global arrays
K = np.zeros( ( num_nodes-1, num_nodes-1 ) )
F = np.zeros( ( num_nodes-1, 1 ) )

# Global node number given an element index (i.e. starting at element zero)
# and an element node index (i.e. also starting at zero)
#   e.g. IEN(0,0) - element 0 and node 0 within that element
def IEN ( _element, _element_node ):

    return _element+_element_node

# Get index into K and F arrays given a node number
# Returns -1 if the node is not in K and F
def ID ( A ):

    # return A
    return -1 if A == 0 else A-1


# Element loop
for element in range( num_elements ):

    ke = np.zeros( ( num_element_nodes, num_element_nodes ) )
    fe = np.zeros( ( num_element_nodes, 1 ) )

    i_left = IEN( element, 0 )
    i_right = IEN( element, 1 )

    x_element = [ x_coord[ i_left ], x_coord[ i_right ] ]

    J = 0.5 * ( x_element[1] - x_element[0] )

    # Integration loop
    for i in range( num_int_points ):

        N = [ Nt for Nt in Ntilde ]
        dNdx = [ dNt/J for dNt in dNtilde ]

        # Node loop
        for row in range( num_element_nodes ):

            fe[ row, 0 ] = ( N[ row ] * s( x_element[ row ] ) * J * w_int ) + \
                           ( area * N[ row ] * h( element, row ) )

            for col in range( num_element_nodes ):

                ke[ row, col ] = dNdx[ row ] * area * k * dNdx[ col ] * J * w_int
                fe[ row, 0 ] -= ke[ row, col ] * u( element, row )

    print fe
    print ke

    # Update globals with contributions from local
    for row in range( num_element_nodes ):

        row_node = IEN( element, row )
        ROW = ID( row_node )

        if ROW != -1:

            F[ ROW, 0 ] += fe[ row, 0 ]

            for col in range( num_element_nodes ):

                col_node = IEN( element, col )
                COL = ID( col_node )

                if COL != -1:

                    K[ ROW, COL ] += ke[ row, col ]

d = np.linalg.solve( K, F )
print d
x = x_coord
y = d[:,0]

y = np.insert( y, 0, 0 )
# y = np.append( y, 0 )

#plt.plot( x, y )
#plt.show()