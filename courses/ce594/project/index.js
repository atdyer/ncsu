function render_equations ( equations ) {

    for ( var e in equations ) {

        if ( equations.hasOwnProperty( e ) ) {

            katex.render( equations[ e ], d3.select( '#'+e ).nodes()[ 0 ], { displayMode: true } );

        }

    }

}

function render_inline_equations ( ) {

    d3.selectAll( '.ie' ).each( function () {

        katex.render( d3.select( this ).text(), this );

    });

}

var equations = {
    'e1': 'q = -k\\frac{dh}{dx}',
    'e2': '\\frac{d}{dx}(Aq)-s = 0',
    'e3': '\\begin{matrix} A & = & 2\\text{m}^2 \\\\ k & = & 250\\text{m/day} \\\\ \\alpha_0 & = & -5\\text{m/day} \\end{matrix}',
    'e4': '\\frac{d}{dx}(-Ak\\frac{du}{dx}) - S = 0',
    'e5': 'u(L) = 3',
    'e6': '\\frac{du}{dx}(0) = -0.2',
    'e7': '\\int_\\Omega \\frac{dw}{dx}Ak\\frac{du}{dx}dx = \\int_\\Omega wS dx - wAk\\frac{du}{dx}\\Biggr|_{\\Gamma_h}',
    'e8': 'a(w^h,v^h) - (w^h,v^h) = (w^h,g^h) - a(w^h,g^h) - w^hAk\\frac{du}{dx}\\Biggr|_{\\Gamma_h}',
    'e9': '([K] - [M])\\{d\\} = [F]'
};

render_equations( equations );
render_inline_equations();