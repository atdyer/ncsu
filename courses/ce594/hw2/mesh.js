
function Mesh_1d ( a, b, num_elements ) {

    var self = this;

    this.f = null;

    // Values
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

        // Number of integration points
        var num_integration_points = 1;

        // Cumulative error
        var error = 0;

        var gauss = gauss_parameters( num_integration_points );

        for ( var e=0; e<self.num_elements; ++e ) {

            var x1 = self.nodes[e];
            var x2 = self.nodes[e+1];

            var d1 = self.nodal_values[e];
            var d2 = self.nodal_values[e+1];

            var jacobian = 0.5 * ( x2 - x1 );

            var shape_functions = self.shape_functions[e];

            for ( var i=0; i<gauss.points.length; ++i ) {

                // Get quadrature weight and point
                var point = gauss.points[i];
                var weight = gauss.weights[i];

                // Get the point in global coordinates
                var x = 0.5 * ( x2 + x1 ) + 0.5 * point * ( x2 - x1 );

                // Get the actual point value
                var u = self.f( x );

                // Get the FE estimate
                var ue = d1*shape_functions[0](x) + d2*shape_functions[1](x);

                // Add to the error
                error += Math.pow( ue-u, 2 ) * weight * jacobian;

            }

        }

        return Math.sqrt( error );

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