
// Import the gauss quadrature code
var gauss_quadrature = require( '../gauss-quadrature' );

// Create the function we want to integrate
var f = function ( x ) {
    return Math.pow( x, 2 ) + 1;
};

// Calculate integral using two quadrature points
var solution = gauss_quadrature( f, 0, 4, 2 );

// Print the solution
console.log( solution ); // Prints 25.333333333
