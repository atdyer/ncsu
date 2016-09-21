
function gauss_quadrature ( f, a, b, n ) {

    var summation = 0;
    var c0 = ( b - a ) / 2.0;
    var c1 = ( a + b ) / 2.0;

    var weights =
        n == 1 ? [ 2 ] :
        n == 2 ? [ 1, 1 ] :
        n == 3 ? [ 0.8888888888888888, 0.5555555555555556, 0.5555555555555556 ] :
        n == 4 ? [ 0.6521451548625461, 0.6521451548625461, 0.3478548451374538, 0.3478548451374538 ] :
        n == 5 ? [ 0.5688888888888889, 0.4786286704993665, 0.4786286704993665, 0.2369268850561891, 0.2369268850561891 ] :
        [];

    var points =
        n == 1 ? [ 0 ] :
        n == 2 ? [ -0.5773502691896257, 0.5773502691896257 ] :
        n == 3 ? [ 0, -0.7745966692414834, 0.7745966692414834 ] :
        n == 4 ? [ -0.3399810435848563, 0.3399810435848563, -0.8611363115940526, 0.8611363115940526 ] :
        n == 5 ? [ 0, -0.5384693101056831, 0.5384693101056831, -0.9061798459386640, 0.9061798459386640 ] :
        [];


    function approximation ( w, x ) {

        return w * f ( c0 * x + c1 );

    }

    for ( var i=0; i<n; ++i ) {

        summation += approximation( weights[i], points[i] );

    }

    summation *= c0;


    return summation;

}

// Export so that gauss_quadrature can be require()'d in other scripts
module.exports = gauss_quadrature;