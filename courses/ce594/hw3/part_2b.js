function part_2b ( selection, data ) {

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
        .y( function ( d ) { return d.y; } );

    // Function to call when change occurs
    function change () {

        var ne = +this.value;
        var selection = chart_stage.selectAll( '.chart' )
            .data( [[data[ ne-initial_value ].values]] );

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