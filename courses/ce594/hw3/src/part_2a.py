import matplotlib.pyplot as plt
from fe import solve_fe

### Constants
A = 0.1
k = 0.5
l = 1.0

### Mesh
num_elements = 10
num_element_nodes = 2
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
def exact ( _x ):
    return 10 + 100*_x - 100*pow( _x, 3)/6.0

xe = [ float(i) * ( l / ( 250 - 1 ) ) for i in range( 250 ) ]
ye = [ exact( _x ) for _x in xe ]

### Plot
plt.plot( x, d, label='FE Solution' )
plt.plot( xe, ye, label='Exact Solution')
plt.legend( loc=2 )
plt.show()
