
var math = require( 'mathjs' );

var x_left = 0;
var x_right = 1;
var left_boundary_value = 0;
var right_boundary_value = 0;
var num_elements = 8;
var num_element_nodes = 2;

// Create mesh
var mesh = Mesh(
    x_left,
    x_right,
    left_boundary_value,
    right_boundary_value,
    num_elements,
    num_element_nodes
);

// Solve 1d Head equation
var area = 0.1;
var k = 0.5;
var source = 5;

Heat_1d( area, k, source, mesh );


function Mesh ( xl, xr, bl, br, num_elements, num_element_nodes ) {

    // Create the IEN matrix
    var IEN = math.zeros( num_element_nodes, num_elements );
    var node_number = 1;

    for ( var element=0; element<num_elements; ++element ) {

        for ( var node=0; node<num_element_nodes; ++node ) {

            IEN.set( [ node, element ], node_number++ );

        }

        node_number--;

    }

    // Create the ID matrix
    var num_nodes = num_elements * ( num_element_nodes - 1 ) + 1;
    var ID = [];

    for ( node=0; node<num_nodes; ++node ) {
        ID.push( 0 );
    }
    for ( node=1; node<num_nodes-1; ++node ) {
        ID[node] = node;
    }


    // Create the coordinates
    var x_coordinates = [];
    var interval = ( xr - xl ) / ( num_nodes - 1);

    for ( node=0; node<num_nodes; ++node ) {
        x_coordinates.push( xl + node*interval );
    }


    // Return mesh object
    return {
        x_coordinates: x_coordinates,
        ID: ID,
        IEN: IEN,
        left_boundary: bl,
        right_boundary: br,
        degrees_of_freedom: num_nodes-2,
        num_nodes: num_nodes,
        num_elements: num_elements,
        num_element_nodes: num_element_nodes
    }


}

function Heat_1d ( area, k, source, mesh ) {

    // Set up one point integration
    var num_integration_points = 1;
    var x_integration = 0;
    var w_integration = 2;
    var Nt = [ 0.5, 0.5 ];
    var dNt = [ -0.5, 0.5 ];

    // Set up global arrays
    var K = math.zeros( mesh.degrees_of_freedom, mesh.degrees_of_freedom );
    var F = math.zeros( 1, mesh.degrees_of_freedom );

    // Element loop
    for ( var element=0; element<mesh.num_elements; ++element ) {

        console.log( 'Element', element + 1 );

        var ke = math.zeros( mesh.num_element_nodes, mesh.num_element_nodes );
        var fe = math.zeros( 1, mesh.num_element_nodes );

        var x_left = mesh.x_coordinates[ mesh.IEN.get( [0, element] ) ];
        var x_right = mesh.x_coordinates[ mesh.IEN.get( [1, element] ) ];
        var J = jacobian( x_left, x_right );

        // Integration loop
        for ( var i=0; i<num_integration_points; ++i ) {

            console.log( '\tIntegration point', i+1 );

            var dNdx = [ dNt[0] / J, dNt[1] / J ];
            var N = [ Nt[0], Nt[1] ];

            // Node loops
            for ( var a=0; a<mesh.num_element_nodes; ++a ) {

                console.log( '\t\tNode', a+1 );

                fe.set( [1, a], N[a] * source * J * w_integration );

                for ( var b=0; b<mesh.num_element_nodes; ++b ) {

                    console.log( '\t\t\tNode', b+1 );
                    ke.set( [b, a], dNdx[a] * area * k * dNdx[b] * J * w_integration );

                }

            }
        }

        // Update K and F with contributions from ke and fe
        for ( a=0; a<mesh.num_element_nodes; ++a ) {

            console.log( '\tUpdate K and F' );

            var A = mesh.IEN.get( [a, element] )-1;
            var P = mesh.ID[ A ]-1;

            if ( P > -1 ) {

                console.log( '\t\tUpdate F, Node', a+1 );
                F.set( [0, P], F.get( [0, P] ) + fe.get( [0,a] ) );

                for ( b=0; b<mesh.num_element_nodes; ++b ) {

                    var B = mesh.IEN.get( [b, element] )-1;
                    var Q = mesh.ID[ B ]-1;

                    if ( Q > -1 ) {

                        console.log( '\t\t\tUpdate K, Node', b+1 );
                        K.set( [Q,P], K.get( [Q,P] ) + ke.get( [b,a] ))

                    }

                }

            }

        }

    }

    console.log( K );
    console.log( F );

}

function jacobian ( xl, xr ) {
    return 0.5 * ( xr - xl );
}