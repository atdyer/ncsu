
// Create the mesh
var mesh = new Mesh_1d( 0, 1, 2 );


// Create the function we'd like to solve with finite elements
var f = function ( x ) {
    return Math.pow( x, 3 );    // x^3
};

// Tell the mesh what function it will be solving
mesh.set_function( f, 3 );





// Lets do some plotting
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call( d3.axisBottom( x ) );

svg.append("g")
   .attr("class", "y axis")
   .call( d3.axisLeft( y ));