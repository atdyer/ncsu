import matplotlib.pyplot as plt
from fe import solve_fe

### Constants
A = 0.1
k = 0.5
l = 1.0

### Mesh
num_elements = 2
num_element_nodes = 3
num_nodes = num_elements * ( num_element_nodes - 1 ) + 1

### Boundary conditions
# Essential
bc_essential = dict()
bc_essential[ 0 ] = 10

# Natural
bc_natural = dict()
bc_natural[ num_nodes - 1 ] = 25

### Source terms
s = lambda _x: 5 * _x

### Solve
d, x = solve_fe( A, k, l, num_elements, num_element_nodes, s, bc_essential, bc_natural )

### Exact solution as a function
def exact ( _xe ):
    return 10 + 100*_xe - 100*pow( _xe, 3)/6.0

xe = [ float(i) * ( l / ( 250 - 1 ) ) for i in range( 250 ) ]
ye = [ exact( _x ) for _x in xe ]

### Print slope
print 'Slope =', ( d[len(d)-1] - d[len(d)-2] ) / ( x[len(x)-1] - x[len(x)-2] )

### Plot
plt.plot( x, d, label='FE Solution' )
plt.plot( xe, ye, label='Exact Solution')
plt.legend( loc=2 )
plt.show()
