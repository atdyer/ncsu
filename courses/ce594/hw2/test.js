
// Some variables
var domain = [ 0, 1 ];
var range = [ 0, 1 ];
var num_elements = 8;



// Create the mesh
var mesh = new Mesh_1d( domain[0], domain[1], num_elements );


// Create the function we'd like to solve with finite elements
var f = function ( x ) {
    return Math.pow( x, 3 );    // x^3
};

// Tell the mesh what function it will be solving
mesh.set_function( f, 3 );

// Get the finite element field
var fe = mesh.get_fe_field();


var plot = new Plot( 'body', 960, 500, domain, range );
plot.plot_function( f, 250, 'steelblue', '#fdsafdsa' );
plot.plot_function( fe, 250, 'red', '#asddfdsa' );

plot.plot_points( mesh.nodes, mesh.nodal_values, 3 );