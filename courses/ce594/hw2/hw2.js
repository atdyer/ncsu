
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

function load_homework () {
    
    // Load mathjax
    load_mathjax();

    // Load plots
    plot1();
    
}

window.onload = load_homework;