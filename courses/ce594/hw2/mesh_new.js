
var g = require( './gauss-quadrature' );
var gauss_parameters = g.gauss_parameters;

function Mesh_1d ( a, b, num_elements, num_element_nodes, dof ) {

    var self = this;

    self.a = a;
    self.b = b;
    self.dof = dof;
    self.num_elements = num_elements;
    self.num_element_nodes = num_element_nodes;
    self.num_nodes = self.num_elements * ( self.num_element_nodes - 1) + 1;

    self.nodes = [];
    self.nodal_values = [];
    self.elements = [];


    this.get_error = function ( num_integration_points ) {

        // Get the integration points and weights
        var gauss = gauss_parameters( num_integration_points );

        // Cumulative error
        var error = 0;

        // Loop through the elements
        for ( var e=0; e<self.num_elements; ++e ) {

            // Get the element
            var element = self.elements[e];
            var n1 = element[0] - 1;
            var n2 = element[1] - 1;

            // Get the element coordinates
            var x1 = self.nodes[n1];
            var x2 = self.nodes[n2];

            // Get the values at the nodes
            var d1 = self.nodal_values[n1];
            var d2 = self.nodal_values[n2];

            // Get the jacobian
            var j = self.J( x1, x2 );

            // Integrate
            for ( var i=0; i<gauss.points.length; ++i ) {

                var point = gauss.points[i];
                var weight = gauss.weights[i];

                // Get the integration point in global coordinates
                var point_x = self.X( x1, x2, point );

                // Get the actual point value
                var u = self.f( point_x );

                // Get the FE estimate of the value
                var ue = d1*self.N1( point ) + d2*self.N2( point );

                // Add to the error
                error += Math.pow( ue-u, 2 ) * weight * j;

            }

        }

        return Math.sqrt( error );

    };

    this.set_function = function ( f, degree ) {

        self.f = f;
        self.polynomial_degree = degree;

        for ( var i=0; i<self.nodes.length; ++i ) {

            self.nodal_values.push( f( self.nodes[i] ) );

        }

    };

    this.use_linear_shape_functions = function () {

        // Jacobian function
        self.J = function ( x1, x2 ) {

            return 0.5 * ( x2 - x1 );

        };

        // x-mapping function
        self.X = function ( x1, x2, x ) {

            return 0.5 * ( x2 + x1 ) + 0.5 * x * ( x2 - x1 );

        };

        // Left node shape function
        self.N1 = function ( x ) {

            return 0.5 * ( 1 - x );

        };

        // Right node shape function
        self.N2 = function ( x ) {

            return 0.5 * ( 1 + x );

        };

    };

    this._build_mesh = function () {

        // Build nodal locations
        var interval = ( self.b - self.a ) / ( self.num_nodes - 1 );

        for ( var i=0; i<self.num_nodes; ++i ) {

            self.nodes.push( self.a + i*interval );

        }

        // Build elements
        for ( var e=0, n=1; e<self.num_elements; ++e ) {

            var element = [];

            for ( i=0; i<self.num_element_nodes; ++i ) {

                element.push( n+i );

            }

            self.elements.push( element );
            n += self.num_element_nodes-1;

        }

    };

    this.print_mesh = function () {

        for ( var i=0; i<self.num_nodes; ++i ) {

            if ( self.nodal_values.length ) {

                console.log( 'Node ' + (i+1) + '\t:\t' + self.nodes[i].toFixed(4) + '\t:\t' + self.nodal_values[i].toFixed(4) );

            } else {

                console.log( 'Node ' + (i+1) + '\t:\t' + self.nodes[i].toFixed(6) );

            }

        }

        for ( i=0; i<self.num_elements; ++i ) {

            console.log( 'Element ' + (i+1) + ': ' + self.elements[i] )

        }

    };

    self._build_mesh();

}

var mesh = new Mesh_1d( 0, 1, 4, 2, 1 );
mesh.use_linear_shape_functions();
mesh.set_function( function ( x ) { return Math.pow( x, 3 ); });
console.log( mesh.get_error( 1 ) );
