
function load_mathjax () {

    // Set the font size
    MathJax.Hub.Config({
        "HTML-CSS": { scale: 85 }
    });
    
    // Once mathjax has rendered everything, show the resulting equations
    MathJax.Hub.Queue(
        function () {
            $(".math").css('visibility', 'visible');
        }
    );
    
}

function plot1() {

    //// Problem 1
    var domain = [0,1];
    var range = [-0.5,1.5];

    // The x-values of the four nodes
    var x1 = 0/3;
    var x2 = 1/3;
    var x3 = 2/3;
    var x4 = 3/3;

    // Create the four shape functions
    var N1 = (function ( x1, x2, x3, x4 ) {
        return function ( x ) {
            return ((x-x2)*(x-x3)*(x-x4)) / ((x1-x2)*(x1-x3)*(x1-x4));
        }
    })( x1, x2, x3, x4 );

    var N2 = (function ( x1, x2, x3, x4 ) {
        return function ( x ) {
            return ((x-x1)*(x-x3)*(x-x4)) / ((x2-x1)*(x2-x3)*(x2-x4));
        }
    })( x1, x2, x3, x4 );

    var N3 = (function ( x1, x2, x3, x4 ) {
        return function ( x ) {
            return ((x-x1)*(x-x2)*(x-x4)) / ((x3-x1)*(x3-x2)*(x3-x4));
        }
    })( x1, x2, x3, x4 );

    var N4 = (function ( x1, x2, x3, x4 ) {
        return function ( x ) {
            return ((x-x1)*(x-x2)*(x-x3)) / ((x4-x1)*(x4-x2)*(x4-x3));
        }
    })( x1, x2, x3, x4 );

    // Create the plot
    var plot1 = new Plot( '#problem_1_plot', 960, 500, domain, range );

    // Plot the shape functions
    plot1.plot_function( N1, 150, '#98abc5' );
    plot1.plot_function( N2, 150, '#7b6888' );
    plot1.plot_function( N3, 150, '#a05d56' );
    plot1.plot_function( N4, 150, '#ff8c00' );

    // Plot nodal points and add the legend
    plot1.plot_points( [x1, x2, x3, x4], [0, 0, 0, 0], 4 );
    plot1.plot_points( [x1, x2, x3, x4], [1, 1, 1, 1], 4 );
    plot1.add_legend( [ 'N1', 'N2', 'N3', 'N4' ], [ "#98abc5", "#7b6888", "#a05d56", "#ff8c00" ]);

}

function plot3ab() {

    var domain = [ 0, 1 ];
    var range = [ 0, 1 ];

    var plot = new Plot( '#problem_3_plot', 960, 500, domain, range );
    var element_picker = $( '#element_picker' );

    var function_id = 'fe_function';
    var field_id = 'fe_field';
    var points_id = 'fe_points';

    var solve_fe = function ( num_elements ) {

        var mesh = new Mesh_1d( domain[0], domain[1], num_elements );

        var f = function ( x ) {
            return Math.pow( x, 3 );
        };

        mesh.set_function( f, 3 );

        var fe_field = mesh.get_fe_field();

        plot.plot_function( f, 250, 'steelblue', function_id );
        plot.plot_function( fe_field, 250, 'red', field_id );
        plot.plot_points( mesh.nodes, mesh.nodal_values, 3, points_id );
        plot.add_legend( ['Function', 'FE Field'], ['steelblue', 'red'], 'tl');
        plot.set_x_label( 'Error: ' + mesh.get_error().toFixed( 5 ) );

    };

    // Initialize the plot
    solve_fe( element_picker.val() );

    // Listen for events
    element_picker.change( function () {

        if ( element_picker.val() > 100 ) {

            alert( "That's too many elements, Jack" );

        } else {

            solve_fe( element_picker.val() );

        }

    });

}

function plot3c() {

    var domain = [ 0.9, 32 ];
    var range = [ 0.0001, 1 ];

    // Create function to solve
    var f = function ( x ) {
        return Math.pow( x, 3 );
    };

    // Create meshes
    var mesh1 = new Mesh_1d( 0, 1, 1 );
    var mesh2 = new Mesh_1d( 0, 1, 2 );
    var mesh4 = new Mesh_1d( 0, 1, 4 );
    var mesh8 = new Mesh_1d( 0, 1, 8 );
    var mesh16 = new Mesh_1d( 0, 1, 16 );
    var mesh32 = new Mesh_1d( 0, 1, 32 );

    // Set function for all meshes
    mesh1.set_function( f, 3 );
    mesh2.set_function( f, 3 );
    mesh4.set_function( f, 3 );
    mesh8.set_function( f, 3 );
    mesh16.set_function( f, 3 );
    mesh32.set_function( f, 3 );

    // Get errors
    var e1 = mesh1.get_error();
    var e2 = mesh2.get_error();
    var e4 = mesh4.get_error();
    var e8 = mesh8.get_error();
    var e16 = mesh16.get_error();
    var e32 = mesh32.get_error();

    var num_elements = [ 1, 2, 4, 8, 16, 32 ];
    var errors = [ e1, e2, e4, e8, e16, e32 ];

    console.log( errors );

    // Plot errors
    var plot = new Log_Plot( '#problem_3c_plot', 960, 500, domain, range );
    plot.plot_points( num_elements, errors, 4, 'error_points');
    plot.add_labels( '# elements', 'Error' );

    var slope_sum = 0;
    for ( var i=0; i<num_elements.length-1; ++i ) {
        var slope =
            Math.log( errors[i+1] / errors[i] ) /
            Math.log( num_elements[i+1] / num_elements[i] );

        console.log( 'Slope ' + i + ' -> ' + (i+1) + ': ' + slope );
        slope_sum += slope;
    }

    // console.log( e1, e2, e4, e8 );
    console.log( slope_sum / (num_elements.length-1) );

}

function highlight2() {

    $.ajax({
        url: 'gauss-quadrature.js',
        dataType: "text",
        success: function ( data ) {
            var p2a = $('#p2a');
            p2a.text(data.trim());
            hljs.highlightBlock(p2a[0]);
        }
    });

    $.ajax({
        url: 'tests/gauss1.js',
        dataType: 'text',
        success: function ( data ) {
            var p2b = $('#p2b');
            p2b.text(data.trim());
            hljs.highlightBlock(p2b[0]);
        }
    });

    $.ajax({
        url: 'tests/gauss2.js',
        dataType: 'text',
        success: function ( data ) {
            var p2c = $('#p2c');
            p2c.text(data.trim());
            hljs.highlightBlock(p2c[0]);
        }
    });

}

function highlight3() {

    $.ajax({
        url: 'mesh.js',
        dataType: "script",
        success: function ( data ) {
            var p3a = $('#p3a');
            p3a.text(data.trim());
            hljs.highlightBlock(p3a[0]);
        }
    });

}

function load_homework () {
    
    // Load mathjax
    load_mathjax();

    // Load plots
    plot1();
    plot3ab();
    plot3c();

    // Highlight code
    highlight2();
    highlight3();
    
}

window.onload = load_homework;