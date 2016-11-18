
function load_page () {

    // Function to coerce data to numbers
    function row ( d ) {
        return {
            error_energy: +d.error_energy,
            error_l2: +d.error_l2,
            h: + d.h,
            num_element_nodes: +d.num_element_nodes,
            num_elements: +d.num_elements
        }
    }

    // Fetch the data
    d3.csv( 'data/part_2.csv' )
      .row( row )
      .get( function ( error, data ) {

          data = d3.nest()
                   .key( function ( d ) { return d.num_element_nodes } )
                   .entries( data );

          // console.log( data );

          // Create div to hold charts
          var chart_stage = d3.select( 'body' ).append( 'div' ).classed( 'stage', true );

          // Create chart
          var error_energy_chart = chart()
              .x( function ( d ) { return d.h; } )
              .y( function ( d ) { return d.error_energy; } );

          chart_stage.selectAll( 'div' ).data( data )
                     .enter()
                     .append( 'div' )
                     .each( function ( data ) {
                         d3.select( this ).datum( data.values ).call( error_energy_chart );
                     });

      });

}

function chart () {

    var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = 760,
        height = 400,
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        xScale = d3.scaleLog(),
        yScale = d3.scaleLog(),
        xAxis = d3.axisBottom( xScale ),
        yAxis = d3.axisLeft( yScale ),
        line = d3.line().x(X).y(Y);


    function _chart ( selection ) {

        selection.each( function ( data ) {

            // Convert data to standard representation
            data = data.map( function ( d, i ) {
                return [ xValue.call( data, d, i ), yValue.call( data, d, i ) ];
            });

            // Update the x-scale
            xScale
                .domain( d3.extent( data, function ( d ) { return d[0]; } ) )
                .range( [ 0, width - margin.left - margin.right ] );

            // Update the y-scale
            yScale
                .domain( d3.extent( data, function ( d ) { return d[1]; } ) )
                .range( [ height - margin.top - margin.bottom, 0 ] );

            // Select the svg element, if it exists
            var svg = d3.select( this ).selectAll( 'svg' ).data( [data] );

            // Otherwise, create the skeletal chart
            var enter = svg.enter().append( 'svg' );
            var g = enter.append( 'g' );
            g.append( 'path' ).attr( 'class', 'line' );
            g.append( 'g' ).attr( 'class', 'x axis' );
            g.append( 'g' ).attr( 'class', 'y axis' );

            // Update the outer dimensions
            svg = enter.merge( svg )
                       .attr( 'width', width )
                       .attr( 'height', height );

            // Update the inner dimensions
            g = svg.select( 'g' )
                   .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

            // Update the line path
            g.select( '.line' )
             .attr( 'd', line );

            // Update the x-axis
            g.select( '.x.axis' )
                .attr( 'transform', 'translate(0,' + yScale.range()[0] + ')' )
                .call( xAxis );

            // Update the y-axis
            g.select( '.y.axis' )
                .call( yAxis );

        });

    }

    // The x-accessor
    function X( d ) {
        return xScale( d[0] );
    }

    // The y-accessor
    function Y( d ) {
        return yScale( d[1] );
    }

    _chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return _chart;
    };

    _chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return _chart;
    };

    _chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return _chart;
    };

    _chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return _chart;
    };

    _chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return _chart;
    };

    return _chart;
}