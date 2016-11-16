import matplotlib.pyplot as plt
from fe import solve_fe

### Constants
A = 0.1
k = 0.5
l = 1.0

### Mesh
num_elements = 10
num_element_nodes = 3
num_nodes = num_elements * ( num_element_nodes - 1 ) + 1

### Boundary conditions
# Essential
bc_essential = dict()
bc_essential[ 0 ] = 0
bc_essential[ num_nodes-1 ] = 0

# Natural
bc_natural = dict()

# Source terms
s = lambda _x: 5

### Solve
d, x = solve_fe( A, k, l, num_elements, num_element_nodes, s, bc_essential, bc_natural )

### Plot
plt.plot( x, d )
plt.show()
