
function Log_Plot ( container, w, h, domain, range ) {

    // Scoping
    var self = this;

    this.domain = domain;
    this.range = range;

    // Size and margins
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

    this.x = d3.scaleLog()
              .domain( self.domain )
              .range( [0, width] );

    this.y = d3.scaleLog()
              .domain( self.range )
              .range( [height, 0] );

    // Create the plot area
    this.svg = d3.select( container )
                 .append( 'svg' )
                 .attr( 'width', width + margin.left + margin.right )
                 .attr( 'height', height + margin.top + margin.bottom )
                 .append( 'g' )
                 .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

    // Create the axes
    this.svg.append( 'g' )
        .attr( 'class', 'x axis' )
        .attr( 'transform', 'translate(0,' + height + ')' )
        .call( d3.axisBottom( self.x ) );

    this.svg.append( 'g' )
        .attr( 'class', 'y axis' )
        .call( d3.axisLeft( self.y ) );


    this.add_labels = function ( x_label, y_label ) {

        self.svg.append( 'text' )
            .attr( 'class', 'x label' )
            .attr( 'text-anchor', 'end' )
            .attr( 'x', width )
            .attr( 'y', height - 6 )
            .text( x_label );

        self.svg.append( "text" )
            .attr( "class", "y label" )
            .attr( "text-anchor", "end" )
            .attr( "y", 6 )
            .attr( "dy", ".75em" )
            .attr( "transform", "rotate(-90)" )
            .text( y_label );

    };

    this.plot_points = function ( x_values, y_values, radius, id ) {

        var data = _.zip( x_values, y_values );

        var line = d3.line()
                     .x( function ( d ) { return self.x( d[0] ); } )
                     .y( function ( d ) { return self.y( d[1] ); } )
                     .curve( d3.curveCatmullRom.alpha( 0.5 ) );

        var selection = self.svg.selectAll( '#' + id )
                            .data( [data] )
                            .attr( 'd', line );

        selection.enter()
                 .append( 'path' )
                 .attr( 'class', 'line' )
                 .attr( 'id', id )
                 .attr( 'd', line )
                 .attr( 'stroke', 'steelblue' );

        selection.exit().remove();

        self.svg.selectAll( '#p' + id )
            .data( data )
            .attr( 'cx', function ( d ) { return self.x( d[0] ); } )
            .attr( 'cy', function ( d ) { return self.y( d[1] ); } )
            .enter().append( 'circle' )
            .attr( 'class', 'dot' )
            .attr( 'r', radius )
            .attr( 'cx', function ( d ) { return self.x( d[0] ); } )
            .attr( 'cy', function ( d ) { return self.y( d[1] ); } )
            .attr( 'id', id )
            .exit().remove();

    }

}

function Plot ( container, w, h, domain, range ) {
    
    // Scoping
    var self = this;

    this.domain = domain;
    this.range = range;
    
    // Size and margins
    var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;
    
    // Functions to go from data coordinates to screen coordinates
    this.x = d3.scaleLinear().domain( this.domain ).range( [0, width] );
    this.y = d3.scaleLinear().domain( this.range ).range( [height, 0] );
    
    // Create the plot area
    this.svg = d3.select( container )
                 .append( 'svg' )
                 .attr( 'width', width + margin.left + margin.right )
                 .attr( 'height', height + margin.top + margin.bottom )
                 .append( 'g' )
                 .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );
    
    // Create the axes
    this.svg.append( 'g' )
        .attr( 'class', 'x axis' )
        .attr( 'transform', 'translate(0,' + height + ')' )
        .call( d3.axisBottom( self.x ) );
    
    this.svg.append( 'g' )
        .attr( 'class', 'y axis' )
        .call( d3.axisLeft( self.y ) );



    this.add_legend = function ( values, colors, location ) {

        // x-location, default to top right
        var x_text = location == 'tl' ? 40: width - 24;
        var x_box = location == 'tl' ? 18: width - 18;
        var text_anchor = location == 'tl' ? 'start' : 'end';

        self.legend = self.svg
                          .selectAll( '.legend' )
                          .data( values ).enter()
                          .append( 'g' )
                          .attr( 'class', 'legend' )
                          .attr( 'transform', function(d, i) { return "translate(0," + i * 20 + ")"; })
                          .style( 'font', '10px sans-serif' );

        self.legend.append( 'rect' )
            .attr( 'x', x_box )
            .attr( 'width', 18 )
            .attr( 'height', 18 )
            .attr( 'fill', function(d, i) { return colors[i]; } );

        self.legend.append( 'text' )
            .attr( 'x', x_text )
            .attr( 'y', 9 )
            .attr( 'dy', '.35em' )
            .attr( 'text-anchor', text_anchor )
            .text( function( d ) { return d; });

    };

    this.plot_function = function ( f, num_points, color, id ) {

        var interval = ( self.domain[1] - self.domain[0] ) / num_points;
        var x_values = [];
        for ( var i=0; i<num_points+1; ++i ) {
            x_values.push( i*interval );
        }

        var line = d3.line()
                     .x( function ( d ) { return self.x( d ); } )
                     .y( function ( d ) { return self.y( f( d ) ); } );

        var selection = self.svg.selectAll( '#' + id )
                            .data( [x_values] )
                            .attr( 'd', line );

        selection.enter()
                 .append( 'path' )
                 .attr( 'class', 'line' )
                 .attr( 'id', id )
                 .attr( 'd', line )
                 .attr( 'stroke', color );

        selection.exit().remove();

    };

    this.plot_points = function ( x_values, y_values, radius, id ) {

        var data = _.zip( x_values, y_values );

        self.svg.selectAll( '#' + id )
            .data( data )
            .attr( 'cx', function ( d ) { return self.x( d[0] ); } )
            .attr( 'cy', function ( d ) { return self.y( d[1] ); } )
            .enter().append( 'circle' )
            .attr( 'class', 'dot' )
            .attr( 'r', radius )
            .attr( 'cx', function ( d ) { return self.x( d[0] ); } )
            .attr( 'cy', function ( d ) { return self.y( d[1] ); } )
            .attr( 'id', id )
            .exit().remove();

    };

    this.set_x_label = function ( x_label ) {

        if ( !self.x_label ) {

            self.x_label = self.svg.append( 'text' )
                               .attr( 'class', 'x label' )
                               .attr( 'text-anchor', 'end' )
                               .attr( 'x', width )
                               .attr( 'y', height - 6 )
                               .text( x_label );

        } else {

            self.x_label.text( x_label );

        }

    }
    
}