
function Mesh_1d ( a, b, num_elements ) {

    var self = this;

    this.f = null;

    // Values
    this.bounds = [ a, b ];
    this.num_elements = num_elements;
    this.num_nodes = num_elements+1;
    
    // Nodal arrays
    this.nodes = [];
    this.nodal_values = [];

    // Elemental arrays
    this.shape_functions = [];


    this.set_function = function ( f, degree ) {

        self.f = f;
        self.polynomial_degree = degree;
        
        // Calculate known values at each node
        for ( var i=0; i<self.num_nodes; ++i ) {
            
            self.nodal_values.push( self.f( self.nodes[i] ) );
            
        }

    };

    this.initialize_mesh = function ( a, b, num_elements ) {

        if ( num_elements > 0 ) {


            // Create the nodes

            var interval = ( b - a ) / num_elements;

            for ( var i=0; i<self.num_nodes; ++i ) {

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

    this.get_error = function () {

        var f = self.f;
        var fe = self.get_fe_field();

        var error_function = function ( x ) {

            return Math.pow( f( x ) - fe( x ), 2 );

        };

        var a = self.bounds[0];
        var b = self.bounds[1];

        return Math.sqrt( gauss_quadrature( error_function, a, b, 2 ) );

    };

    this.get_fe_field = function () {

        return function ( x ) {

            // Determine which element the value falls into
            for ( var i=0; i<self.num_elements; ++i ) {

                if ( x >= self.nodes[i] && x <= self.nodes[i+1] ) {

                    var shape_functions = self.shape_functions[i];
                    var d1 = self.nodal_values[i];
                    var d2 = self.nodal_values[i+1];
                    return shape_functions[0]( x ) * d1 + shape_functions[1]( x ) * d2;

                }

            }

            return 0;

        }

    };


    // Initialize the mesh
    self.initialize_mesh( a, b, num_elements );

}