
function Mesh_1d ( a, b, num_elements ) {

    var self = this;

    this.f = null;

    // Nodal arrays
    this.nodes = [];

    // Elemental arrays
    this.shape_functions = [];


    this.set_function = function ( f, degree ) {

        self.f = f;
        self.polynomial_degree = degree;

    };

    this.initialize_mesh = function ( a, b, num_elements ) {

        if ( num_elements > 0 ) {


            // Create the nodes

            var interval = ( b - a ) / num_elements;

            for ( var i=0; i<num_elements+1; ++i ) {

                self.nodes.push( a + i*interval );

            }


            // Create the linear shape functions as local to each element.
            // Each element will have two shape functions, one for each node.

            for ( i=0; i<num_elements; ++i ) {

                var x1 = self.nodes[ i ];
                var x2 = self.nodes[ i+1 ];
                var length_element = x2 - x1;

                // Note that we need to use an anonymous function to create
                // these closures from within a for loop

                var N1 = (function ( x2, length_element ) {
                    return function ( x ) {
                        return ( x2 - x ) / length_element;
                    }
                })( x2, length_element );

                var N2 = (function ( x1, length_element ) {
                    return function ( x ) {
                        return ( x - x1 ) / length_element;
                    }
                })( x1, length_element );

                self.shape_functions.push( [ N1, N2 ] );

            }

        } else {

            console.log( 'ERROR: Not enough elements' );

        }

    };


    // Initialize the mesh
    self.initialize_mesh( a, b, num_elements );

}