# Surat-Airport-Connections
To visualize Airport connections from Surat

Technologies Used:

 * HTML/CSS/JS
 * D3 js & TopoJson
 * Map Tiles
 

Initially prepare a playgroud for the map element in HTML like this

```
<div class="map"></div>
```

I have used topojson file here to draw boundaries, file can be found under `data/in-states-topo-json` followed by the natural earth tile drawings which will make map savy looking the details for natural earth can be found [here](http://bl.ocks.org/mbostock/4150951).

Once the Map is rendered, Now its time to load dataset of Airports and then for our flights movement.

The details of airports and cities boundary is stored under file `data/in-demo-topo.json`. The Airport details are stored as 

```
.
.
{
	"type": "Point",
	"coordinates": [
		72.7424, //longitude
		21.1206  //latitude
	],
	"properties": {
		"name": "Surat",
		"code" : "STV"
	}
},
.
.
```
 

Points are populated and labelled by text. Now its time to move plane from source to destination a array is prepared for flight transitions as 

```
var flightDetails = [["STV","BHU"],["STV","DEL"],["STV","BOM"],["STV","RAJ"],["STV","JAI"],["STV","CCU"],["STV","AMD"],["STV","GOI"],["STV","AMR"],["STV","HYD"],["DEL","STV"],["RAJ","STV"],["BOM","STV"],["BHU","STV"],["PAT","CCU"],["AMD","STV"],["JAI","STV"],["AMR","STV"],["GOI","STV"],["HYD","STV"]];
```

Where each element is an array `["STV","DEL"]` denotes origin as Surat and destination as Delhi.By using projection we plot the point betwen origin and destination dwar an imaginary path then animate plane on the path.

```
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
			   .attr("d", "m25.21488,3.93375c ...<svg plane path>");

	transition(plane, route, origin, destination);
```

i.e get the origin and destination airport co-ordinates and then animate the plane through the path. On each transition end make sure you remove the plane.


You have full source code in the repo Enjoy! :+1:
For a live demo see [surat-connectivity-development](http://www.vinodlouis.com/demos/surat-airport-connections/)
