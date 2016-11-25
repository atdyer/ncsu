
function part_1_elements ( selection, data ) {

    // Set up some html
    var num_element_options = data.length;
    var initial_value = +data[0].key;
    var num_elements = selection.select( '.elementspicker' )
        .attr( 'value', initial_value )
        .attr( 'min', initial_value )
        .attr( 'max', initial_value + num_element_options - 1 )
        .attr( 'step', 1 );

    var chart_stage = selection.select( '.elements.stage' );
    var chart_elements = chart()
        .x( function ( d ) { return d.x; } )
        .y( function ( d ) { return d.y; } )
        .xLabel( 'x (m)' )
        .yLabel( 'u (\u2103)' )
        .showPoints( [ true, false ] )
        .pointSize( 3 )
        .legendItems( [ 'FE Solution', 'Exact Solution' ] );

    // Create values for plotting the exact solution
    function exact_solution ( x ) {
        return 50 * x - 50 * Math.pow( x, 2 )
    }
    var n_exact = 100;
    var x_exact = Array.apply( null, new Array( n_exact+1 ) ).map( function ( x, i ) { return i/n_exact; } );

    // Function to call when change occurs
    function change () {

        var ne = +this.value;

        var dat = [];
        dat.push( data[ ne-initial_value ].values  );
        dat.push( x_exact.map( function ( x ) { return {x: x, y: exact_solution(x)}; } ) );

        var selection = chart_stage.selectAll( '.chart' )
                                   .data( [dat] );

        selection = selection.enter()
                             .append( 'div' )
                             .attr( 'class', 'chart' )
                             .merge( selection )
                             .call( chart_elements );

        selection.exit().remove();

    }

    // Listen for events
    num_elements.on( 'change', change );

    // Trigger initial
    num_elements.each( change );

}