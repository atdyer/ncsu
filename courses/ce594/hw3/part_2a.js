
function part_2a ( selection, data ) {

    // Set up some html
    var num_element_options = data.length;
    var initial_value = +data[0].key;
    var num_elements = selection.select( '#num_elements_picker' )
                                .attr( 'value', initial_value )
                                .attr( 'min', initial_value )
                                .attr( 'max', initial_value + num_element_options - 1 )
                                .attr( 'step', 1 );

    var chart_stage = selection.select( '#element_plot_stage' );
    var chart_elements = chart()
        .x( function ( d ) { return d.x; } )
        .y( function ( d ) { return d.y; } );

    // Listen for events
    num_elements.on( 'change', function () {

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

    });

    // // Create div to hold charts
    // var chart_stage = d3.select( 'body' ).append( 'div' ).attr( 'class', 'stage' );
    //
    // // Create chart stamp
    // var elements_chart = chart()
    //   .x( function ( d ) { return d.x; } )
    //   .y( function ( d ) { return d.y; } );
    //
    // // Bind data
    // chart_stage.selectAll( 'div' ).data( data )
    //          .enter()
    //          .append( 'div' )
    //          .each( function ( data ) {
    //
    //              d3.select( this ).selectAll( 'div' ).data( data.values )
    //                .enter()
    //                .append( 'div' )
    //                .each( function ( data ) {
    //
    //                    d3.select( this ).datum( data.values ).call( elements_chart );
    //
    //                });
    //
    //          });

}