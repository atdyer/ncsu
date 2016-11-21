
function part_2a_errors ( selection, data ) {

    console.log( data );

    var chart_stage = selection.select( '.errors.stage' );

    var chart_errors = log_chart()
        .x( function ( d ) { return d.h; } )
        .y( function ( d ) { return d.error_energy; } )
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

function part_2a_elements ( selection, data ) {

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
        .y( function ( d ) { return d.y; } );

    // Function to call when change occurs
    function change () {

        var ne = +this.value;
        var selection = chart_stage.selectAll( '.chart' )
                                   .data( [data[ ne-initial_value ]] );

        selection = selection.enter()
                             .append( 'div' )
                             .attr( 'class', 'chart' )
                             .merge( selection );

        selection.each( function ( d ) {

            d3.select( this ).datum( d.values ).call( chart_elements );

        });
    }

    // Listen for events
    num_elements.on( 'change', change );

    // Trigger initial
    num_elements.each( change );

}