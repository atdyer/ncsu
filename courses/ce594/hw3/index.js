
function load_page () {

    // Function to coerce data to numbers
    function row_error ( d ) {
        return {
            error_energy: +d.error_energy,
            error_l2: +d.error_l2,
            h: + d.h,
            num_element_nodes: +d.num_element_nodes,
            num_elements: +d.num_elements
        }
    }

    function row_element ( d ) {
        return {
            num_element_nodes: +d.num_element_nodes,
            num_elements: +d.num_elements,
            x: +d.x,
            y: +d.y
        }
    }


    d3.csv( 'data/part_2_elements.csv' )
      .row( row_element )
      .get( function ( error, data ) {

          data = d3.nest()
              .key( function ( d ) { return d.num_element_nodes } )
              .key( function ( d ) { return d.num_elements } )
              .entries( data );

          part_2a( d3.select( '#p2a' ), data[0].values );
          part_2b( d3.select( '#p2b' ), data[1].values );

      });


    // Fetch the data
    // d3.csv( 'data/part_2.csv' )
    //   .row( row_error )
    //   .get( function ( error, data ) {
    //
    //       data = d3.nest()
    //                .key( function ( d ) { return d.num_element_nodes } )
    //                .entries( data );
    //
    //       // console.log( data );
    //
    //       // Create div to hold charts
    //       var chart_stage = d3.select( 'body' ).append( 'div' ).classed( 'stage', true );
    //
    //       // Create chart
    //       var error_energy_chart = chart()
    //           .x( function ( d ) { return d.h; } )
    //           .y( function ( d ) { return d.error_energy; } );
    //
    //       chart_stage.selectAll( 'div' ).data( data )
    //                  .enter()
    //                  .append( 'div' )
    //                  .each( function ( data ) {
    //                      d3.select( this ).datum( data.values ).call( error_energy_chart );
    //                  });
    //
    //   });

}