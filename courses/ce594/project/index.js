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

function render_plots () {

    d3.csv( 'data/solution.csv' )
        .row( function ( d ) {
            return {
                num_element_nodes: +d.num_element_nodes,
                num_elements: +d.num_elements,
                x: +d.x,
                y: +d.y
            }
        })
        .get( function ( error, data ) {

            // Organize the data
            data = d3.nest()
                .key( function ( d ) { return d.num_element_nodes; } )
                .key( function ( d ) { return d.num_elements; } )
                .entries( data );

            // Get selectors from page
            var num_element_nodes = d3.select( '#nen_picker' )
                .attr( 'value', 2 )
                .attr( 'min', 2 )
                .attr( 'max', 9 )
                .attr( 'step', 1 );

            var num_elements = d3.select( '#ne_picker' )
                .attr( 'value', 8 )
                .attr( 'min', 1 )
                .attr( 'max', 8 )
                .attr( 'step', 1 );

            // The chart stamp
            var c = chart()
                .x( function ( d ) { return d.x; } )
                .y( function ( d ) { return d.y; } )
                .yRange( [ 2.8, 3.5 ] )
                .xLabel( 'x (m)' )
                .yLabel( 'Hydraulic Head (m)')
                .showPoints( [ true, false ])
                .pointSize( 3 )
                .legendItems( [ 'FE Solution', 'Exact Solution' ] );

            // The exact solution data
            function exact_solution ( x ) {
                return Math.exp( -x / 10.0 ) * ( 2.73368 + 0.73367 * Math.exp ( x / 5.0 ) )
            }
            var n_exact = 250;
            var x_exact = Array.apply( null, new Array( n_exact+1 ) ).map( function ( x, i ) { return 10*i/n_exact; } );
            var exact = x_exact.map( function ( x ) { return {x: x, y: exact_solution(x)}; } );

            function change () {

                var nen = +num_element_nodes.property( 'value' );
                var ne = +num_elements.property( 'value' );

                var dat = [];
                dat.push( data[ nen-2 ].values[ ne-1 ].values );
                dat.push( exact );

                var selection = d3.select( '#plots' )
                    .selectAll( '.chart' )
                    .data( [dat] );

                selection = selection.enter()
                    .append( 'div' )
                    .attr( 'class', 'chart' )
                    .merge( selection )
                    .call( c );

                selection.exit().remove();

            }

            change();

            num_element_nodes.on( 'change', change );
            num_elements.on( 'change', change );

        })

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
render_plots();