function part_2b_errors ( selection, data ) {

    var chart_stage = selection.select( '.errors.stage' );

    var chart_errors = chart()
        .x( function ( d ) { return d.h; } )
        .y( function ( d ) { return d.error_energy; } )
        .xScale( d3.scaleLog() )
        .yScale( d3.scaleLog() )
        .xRange( [ .02, 1 ] )
        .yRange( [ .02, 1.5 ] )
        .xLabel( 'Element size' )
        .yLabel( 'Error in Energy Norm')
        .legendItems( [
            '2 Element Nodes',
            '3 Element Nodes',
            '4 Element Nodes' ] );

    var select = chart_stage.selectAll( '.chart' )
                            .data( [data] );

    select = select.enter()
                   .append( 'div' )
                   .attr( 'class', 'chart' )
                   .merge( select )
                   .call( chart_errors );

    select.exit().remove();
    
}

function part_2b_elements ( selection, data ) {

    // Set up some html
    var num_element_options = data.length;
    var initial_value = +data[0].key;
    var num_elements = selection.select( '.elementspicker' )
        .attr( 'value', initial_value )
        .attr( 'min', initial_value )
        .attr( 'max', initial_value + num_element_options - 1 )
        .attr( 'step', 1 );

    var chart_stage = selection.select( '.stage' );
    var chart_elements = chart()
        .x( function ( d ) { return d.x; } )
        .y( function ( d ) { return d.y; } )
        .xLabel( 'x (m)' )
        .yLabel( 'u (\u2103)')
        .showPoints( [ true, false ] )
        .pointSize( 3 )
        .legendItems( [ 'FE Solution', 'Exact Solution' ]);

    // Create values for plotting the exact solution
    function exact_solution ( x ) {
        return 100 * x + 10 - ( 100 * Math.pow( x, 3 ) / 6.0 );
    }
    var n_exact = 100;
    var x_exact = Array.apply( null, new Array( n_exact+1 ) ).map( function ( x, i ) { return i/n_exact; } );

    // Function to call when change occurs
    function change () {

        var ne = +this.value;

        var plot = [
            data[ ne-initial_value ].values,
            x_exact.map( function ( x ) { return { x: x, y: exact_solution( x ) }; } )
        ];

        var selection = chart_stage.selectAll( '.chart' )
            .data( [plot] );

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