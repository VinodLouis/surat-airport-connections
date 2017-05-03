var flightDetails = [["STV","BHU"],["STV","DEL"],["STV","BOM"],["STV","RAJ"],["STV","JAI"],["STV","CCU"],["STV","AMD"],["STV","GOI"],["STV","AMR"],["STV","HYD"],["DEL","STV"],["RAJ","STV"],["BOM","STV"],["BHU","STV"],["PAT","CCU"],["AMD","STV"],["JAI","STV"],["AMR","STV"],["GOI","STV"],["HYD","STV"]];

var width = 800,
    height = 580;

var projection = d3.geo.mercator()
  .center([83, 23.5])
  .scale(890);

var path = d3.geo.path()
  .projection(projection)
  .pointRadius(2);
  
var tile = d3.geo.tile()
    .scale(projection.scale() * 2 * Math.PI)
    .translate(projection([0, 0]))
    .zoomDelta((window.devicePixelRatio || 1) - .5);

var svg = d3.select(".map")
  .append("svg")
    .attr("width", width)
    .attr("height", height);



var defs = svg.append("defs");

var ne = svg.append("g")
  .attr("id", "natural-earth");

var india = svg.append("g")
  .attr("id", "india");

var indiaPlaces = svg.append("g")
  .attr("id", "places");

var states = svg.append("g")
  .attr("id", "states");


var suratPos =  [72.7424, 21.1206];
var airports =[];

function fly(origin, destination) {
	var originDetails = airports.find(function(el){
		return el.properties.code == origin;
	});
	
	var destinationDetails = airports.find(function(el){
		return el.properties.code == destination;
	});

	var route = svg.append("path")
			   .datum({type: "LineString", coordinates: [originDetails.coordinates, destinationDetails.coordinates]})
			   .attr("class", "route")
			   .attr("d", path);


	var plane = svg.append("path")
			   .attr("class", "plane")
			   .attr("d", "m25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z");

	transition(plane, route, origin, destination);
}
  
function transition(plane, route, origin, destination) {
	var l = route.node().getTotalLength();
	plane.transition()
	.duration(l * 100)
	.attrTween("transform", delta(plane, route.node()))
	.each("end", function() { 
		route.remove(); 
		if(origin == "STV" && destination == "CCU"){
			fly("CCU","PAT");
		}
		if(origin == "PAT" && destination == "CCU"){
			fly("CCU","STV")
		}
		
	})
	.remove();
}
  
function delta(plane, path) {
	var l = path.getTotalLength();
	var plane = plane;
	return function(i) {
		return function(t) {
			var p = path.getPointAtLength(t * l);

			var t2 = Math.min(t + 0.05, 1);
			var p2 = path.getPointAtLength(t2 * l);

			var x = p2.x - p.x;
			var y = p2.y - p.y;
			var r = 90 - Math.atan2(-y, x) * 180 / Math.PI;

			var s = Math.min(Math.sin(Math.PI * t) * 0.7, 0.3);

			return "translate(" + p.x + "," + p.y + ") scale(" + s + ") rotate(" + r + ")";
		}
	}
}

function drawIndia(data) {
  var subunits = topojson.object(data, data.objects.subunits);

	india.selectAll("path.subpath")
    .data(subunits.geometries)
    .enter().append("path")
      .attr('class', function(d) { return 'subunit ' + d.id; })
      .attr('id', function(d) { return d.id; })
      .attr("d", path);
}

function drawIndiaPlaces(data) {
	indiaPlaces.selectAll("circle.place")
      .data(data.objects.places.geometries)
      .enter().append("circle")
      .attr("cx", function(d){ return projection(d.coordinates)[0]})
	  .attr("cy", function(d){ return projection(d.coordinates)[1]})
	  .attr("r",2)
      .attr("class", "place")
	  
	indiaPlaces.selectAll("text.place")
      .data(data.objects.places.geometries)
      .enter().append("text")
      .attr("x", function(d){ return projection(d.coordinates)[0]+3})
	  .attr("y", function(d){ return projection(d.coordinates)[1]+3})
	  .text(function(d){ return d.properties.name})
      .attr("class", function(d){ return "air-" + d.properties.name});
		
	indiaPlaces.append("circle")
		.attr("stroke-width", 5)
		.attr("r", 2)
		.attr("cx", projection(suratPos)[0])
		.attr("cy", projection(suratPos)[1])
		.attr("id","sur-ant")
}

// Code from D3 United States Example at http://bl.ocks.org/4150951
function drawNaturalEarth() {
  var tiles = tile();

  india.selectAll('.subunit')
    .classed('natural-earth', true);

  var clips = defs.append("clipPath")
      .attr("id", "clip");
  clips.append("use")
      .attr("xlink:href", "#INX");
  clips.append("use")
      .attr("xlink:href", "#INA");
  clips.append("use")
      .attr("xlink:href", "#INN");
  clips.append("use")
      .attr("xlink:href", "#INL");

  ne.attr("clip-path", "url(#clip)")
      .selectAll("image")
        .data(tiles)
      .enter().append("image")
        .attr("xlink:href", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-2/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
        .attr("width", Math.round(tiles.scale))
        .attr("height", Math.round(tiles.scale))
        .attr("x", function(d) { return Math.round((d[0] + tiles.translate[0]) * tiles.scale); })
        .attr("y", function(d) { return Math.round((d[1] + tiles.translate[1]) * tiles.scale); });
}

function drawStates(callback) {
  d3.json("data/in-states-topo.json", function(data) {
    states.selectAll("path")
        .data(topojson.object(data, data.objects.states).geometries)
      .enter().append("path")
        .attr('class', "state")
        .attr("title", function(d) { return d.properties.name; })
        .attr("d", path)
        
	callback();
  });
}

d3.json("data/in-demo-topo.json", function(error, data) {
	drawNaturalEarth();
	drawIndia(data);
	drawIndiaPlaces(data);
	airports = data.objects.places.geometries;
	drawStates(function() {

		var i = 0;
		setTimeout(function(){
			setInterval(function() {
			  if (i == flightDetails.length) {
				i = 0;
			  }
			  var od = flightDetails[i];
			  fly(od[0], od[1]);
			  i++;
			}, 1000);
		},500)
		
		
		var circle = svg.select("#sur-ant");
		(function repeat() {
			circle = circle.transition()
				.duration(2000)
				.attr("stroke-width", 5)
				.attr("r", 2)
				.transition()
				.duration(2000)
				.attr('stroke-width', 0.5)
				.attr("r", 20)
				.ease('sine')
				.each("end", repeat);
		})();
			
	});
});