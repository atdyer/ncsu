
// Import the gauss quadrature code
var gauss_quadrature = require( '../gauss-quadrature' );

// Create the function we want to integrate
var f = function ( x ) {
    return Math.pow( x, 4 ) + 2*Math.pow( x, 2 );
};

// Calculate the integral using three quadrature points
var solution = gauss_quadrature( f, -1, 1, 3);

// Print the solution
console.log( solution ); // Prints 1.7333333333