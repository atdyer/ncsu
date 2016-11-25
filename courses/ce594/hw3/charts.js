
function chart () {

    var margin = {top: 20, right: 220, bottom: 20, left: 40},
        width = 960,
        height = 400,
        xValue = function(d) { return d[0]; },
        yValue = function(d) { return d[1]; },
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        xAxis = d3.axisBottom( xScale ),
        yAxis = d3.axisLeft( yScale ),
        xLabel = '',
        yLabel = '',
        xRange, yRange,
        legend = [],
        line = d3.line().x(X).y(Y),
        colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"],
        showPoints,
        pointSize = 1.5;

    function _chart ( selection, d ) {

        selection.each( function ( data ) {

            // Convert data to standard representation greedily
            data = data.map( function ( _d ) {
                return _d.map( function ( __d, __i ) {
                    return [xValue.call( data, __d, __i ), yValue.call( data, __d, __i )];
                });
            });

            if ( !showPoints ) {
                showPoints = data.map( function ( _d ) {
                    return true;
                });
            }

            // Select the svg element, if it exists
            var svg = selection.selectAll( 'svg' ).data( [data] );

            // If it doesn't, create the chart
            var enter = svg.enter().append( 'svg' );
            var g = enter.append( 'g' );
            g.append( 'g' ).attr( 'class', 'x axis' );
            g.append( 'g' ).attr( 'class', 'y axis' );
            g.append( 'text' )
             .attr( 'class', 'x label' )
             .attr( 'text-anchor', 'end' )
             .attr( 'x', width - margin.left - margin.right )
             .attr( 'y', height - margin.top - margin.bottom - 6 )
             .style( 'font', '10px sans-serif');
            g.append( 'text' )
             .attr( 'class', 'y label' )
             .attr( 'text-anchor', 'end' )
             .attr( 'y', 6 )
             .attr( 'dy', '.75em' )
             .attr( 'transform', 'rotate(-90)' )
             .style( 'font', '10px sans-serif');
            g.append( 'g' )
             .attr( 'class', 'legend' )
             .attr( 'transform', 'translate(' + ( width - margin.right - margin.left + 24 ) + ',0)' );

            // Update the outer dimensions
            svg = enter.merge( svg )
                .attr( 'width', width )
                .attr( 'height', height );

            // Update the inner dimensions
            g = svg.select( 'g' )
                .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

            // Update the axis labels
            g.select( '.x.label' ).text( xLabel );
            g.select( '.y.label' ).text( yLabel );

            // Bind data to lines
            var lines = g.selectAll( '.line' ).data( data );

            // Add lines if they don't exist
            lines = lines.enter()
                .append( 'path' )
                .attr( 'class', 'line' )
                .merge( lines );

            lines.each( function ( data, index ) {

                // Expand the scales as necessary
                var current_xdomain = xScale.domain();
                var current_ydomain = yScale.domain();
                var x_extent = d3.extent( data, function ( d ) { return d[0]; } );
                var y_extent = d3.extent( data, function ( d ) { return d[1]; } );

                if ( xRange )
                    xScale.domain( xRange );
                else
                    xScale.domain( d3.extent( current_xdomain.concat( x_extent ) ) ).nice();

                xScale.range( [ 0, width - margin.left - margin.right ]);

                if ( yRange )
                    yScale.domain( yRange );
                else
                    yScale.domain( d3.extent( current_ydomain.concat( y_extent ) ) ).nice();

                yScale.range( [ height - margin.top - margin.bottom, 0 ] );

                // Set the line's color
                d3.select( this )
                    .style( 'stroke', colors[ index ] );

            });

            // Render lines
            lines.attr( 'd', line );

            // Flatten data for points
            var point_data = data.reduce( function ( a, b, i ) {
                if ( showPoints[i] ) return a.concat( b );
                return a;
            }, []);

            // Update the points
            var select_points = g.selectAll( '.dot' ).data( point_data );

            select_points
                .enter()
                .append( 'circle' )
                .attr( 'class', 'dot' )
                .style( 'fill', 'black' )
                .merge( select_points )
                .attr( 'cx', X )
                .attr( 'cy', Y )
                .attr( 'r', pointSize );

            select_points.exit().remove();

            // Update the x-axis
            g.select( '.x.axis' )
                .attr( 'transform', 'translate(0,' + yScale.range()[0] + ')' )
                .call( xAxis );

            // Update the y-axis
            g.select( '.y.axis' )
                .call( yAxis );

            // Update the legend
            var leg = g.select( '.legend' )
                       .selectAll( '.legend.item' )
                       .data( legend );

            leg = leg.enter()
                     .append( 'g' )
                     .attr( 'class', 'legend item' )
                     .attr( 'transform', function ( d, i ) { return 'translate(0,' + i*20 + ')'; } )
                     .style( 'font', '10px sans-serif' );

            leg.append( 'rect' )
                .attr( 'width', 18 )
                .attr( 'height', 18 )
                .attr( 'fill', function ( d, i ) { return colors[i]; } );

            leg.append( 'text' )
               // .attr( 'text-anchor', 'end' )
               .attr( 'y', 9 )
               .attr( 'dx', 24 )
               .attr( 'dy', '.35em' )
               .merge( leg )
               .text( function ( d ) { return d; } );
            
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

    _chart.xRange = function (_) {
        if (!arguments.length) return xRange;
        xRange = _;
        return _chart;
    };

    _chart.yRange = function (_) {
        if (!arguments.length) return yRange;
        yRange = _;
        return _chart;
    };

    _chart.xScale = function (_) {
        if (!arguments.length) return xScale;
        xScale = _;
        xAxis = d3.axisBottom( xScale );
        return _chart;
    };

    _chart.yScale = function (_) {
        if (!arguments.length) return yScale;
        yScale = _;
        yAxis = d3.axisLeft( yScale );
        return _chart;
    };

    _chart.xLabel = function (_) {
        if (!arguments.length) return xLabel;
        xLabel = _;
        return _chart;
    };

    _chart.yLabel = function (_) {
        if (!arguments.length) return yLabel;
        yLabel = _;
        return _chart;
    };
    
    _chart.legendItems = function (_) {
        if (!arguments.length) return legend;
        legend = _;
        return _chart;
    };
    
    _chart.showPoints = function (_) {
        if (!arguments.length) return showPoints;
        showPoints = _;
        return _chart;
    };

    _chart.pointSize = function (_) {
        if (!arguments.length) return pointSize;
        pointSize = _;
        return _chart;
    };

    return _chart;
}