
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



    this.add_legend = function ( values, colors ) {

        self.legend = self.svg
                          .selectAll( '.legend' )
                          .data( values ).enter()
                          .append( 'g' )
                          .attr( 'class', 'legend' )
                          .attr( 'transform', function(d, i) { return "translate(0," + i * 20 + ")"; })
                          .style( 'font', '10px sans-serif' );

        self.legend.append( 'rect' )
            .attr( 'x', width - 18 )
            .attr( 'width', 18 )
            .attr( 'height', 18 )
            .attr( 'fill', function(d, i) { return colors[i]; } );

        self.legend.append( 'text' )
            .attr( 'x', width - 24 )
            .attr( 'y', 9 )
            .attr( 'dy', '.35em' )
            .attr( 'text-anchor', 'end' )
            .text( function( d ) { return d; });

    };

    this.plot_function = function ( f, num_points, color ) {

        var interval = ( self.domain[1] - self.domain[0] ) / num_points;
        var x_values = [];
        for ( var i=0; i<num_points+1; ++i ) {
            x_values.push( i*interval );
        }
        
        var line = d3.line()
                     .x( function ( d ) { return self.x( d ); } )
                     .y( function ( d ) { return self.y( f( d ) ); } );

        self.svg.append( 'path' )
            .datum( x_values )
            .attr( 'class', 'line' )
            .attr( 'd', line )
            .attr( 'stroke', color );

    };

    this.plot_points = function ( x_values, y_values, radius ) {

        var data = _.zip( x_values, y_values );

        self.svg.selectAll( '.' + guid() )
            .data( data )
            .enter().append( 'circle' )
            .attr( 'class', 'dot' )
            .attr( 'r', radius )
            .attr( 'cx', function ( d ) { return self.x( d[0] ); } )
            .attr( 'cy', function ( d ) { return self.y( d[1] ); } );

    }
    
}