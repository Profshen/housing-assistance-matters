function drawGraphic(containerWidth){
	d3.selectAll("svg").remove()
	var width = containerWidth,
    height = containerWidth/2,
    centered;
	var dispatch = d3.dispatch("load");
	var data = d3.map();

	d3.csv("../data/source/HAI_commsoutput_2013.csv", function(error, counties) {
		if (error) throw error;
		counties.forEach(function(d) {
		  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
		  data.set(FIPS,{
		  	"id": FIPS,
		    "name": d["County Name"],
		    "state": d["State Name"],
		    "2013": {"aaa":{
		    				"on":d["Units per 100 renters"],
		    				"off": d["Units per 100 renters (asst off)"]
		    				}	
		    		}

		  })
		});
		d3.csv("../data/source/HAI_commsoutput_2000.csv", function(error, counties) {
		if (error) throw error;
		counties.forEach(function(d) {
		  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
		  data.get(FIPS)["2000"] =
					{"aaa":{
		    				"on":d["Units per 100 renters"],
		    				"off": d["Units per 100 renters (asst off)"]
		    				}	
		    		}
			});
			d3.csv("../data/source/HAI_commsoutput_2006.csv", function(error, counties) {
			if (error) throw error;
			counties.forEach(function(d) {
			  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
			  data.get(FIPS)["2006"] =
						{"aaa":{
			    				"on":d["Units per 100 renters"],
			    				"off": d["Units per 100 renters (asst off)"]
			    				}	
			    		}
				});
				d3.csv("../data/source/HAI_commsoutput_2012.csv", function(error, counties) {
				if (error) throw error;
				counties.forEach(function(d) {
				  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
				  data.get(FIPS)["2012"] =
							{"aaa":{
				    				"on":d["Units per 100 renters"],
				    				"off": d["Units per 100 renters (asst off)"]
				    				}	
				    		}
					});
				});//end 2012
			});//end 2006
		});//end 2000
	});//end 2013

	// d3.csv("../data/source/HAI_commsoutput_2006.csv", function(error, counties) {
	// 	if (error) throw error;
	// 	counties.forEach(function(d) {
	// 	  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
	// 	  data.get(FIPS)["2006"] =
	// 				{"aaa":{
	// 	    				"on":d["Units per 100 renters"],
	// 	    				"off": d["Units per 100 renters (asst off)"]
	// 	    				}	
	// 	    		}


	// 	});
	// });
	// d3.csv("../data/source/HAI_commsoutput_2012.csv", function(error, counties) {
	// 	if (error) throw error;
	// 	counties.forEach(function(d) {
	// 	  var FIPS = (d.county == "National") ? 1 : parseInt(d.county, 10);
	// 	  data.get(FIPS)["2012"] =
	// 				{"aaa":{
	// 	    				"on":d["Units per 100 renters"],
	// 	    				"off": d["Units per 100 renters (asst off)"]
	// 	    				}	
	// 	    		}


	// 	});
	// });

		console.log(data)


	var projection = d3.geo.albersUsa()
	    .scale(width)
	    .translate([width / 2, height / 2]);

	var path = d3.geo.path()
	    .projection(projection);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	svg.append("rect")
	    .attr("class", "background")
	    .attr("width", width)
	    .attr("height", height)
	    .on("click", clicked);

	var g = svg.append("g");

	d3.json("data/geo/us.json", function(error, us) {
	  g.append("g")
	      .attr("id", "states")
	    .selectAll("path")
	      .data(topojson.feature(us, us.objects.states).features)
	    .enter().append("path")
	      .attr("d", path)
	      .on("click", clicked);

	  g.append("path")
	      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
	      .attr("id", "state-borders")
	      .attr("d", path);
	});

	function clicked(d) {
	  var x, y, k;

	  if (d && centered !== d) {
	    var centroid = path.centroid(d);
	    x = centroid[0];
	    y = centroid[1];
	    k = 4;
	    centered = d;
	  } else {
	    x = width / 2;
	    y = height / 2;
	    k = 1;
	    centered = null;
	  }

	  g.selectAll("path")
	      .classed("active", centered && function(d) { return d === centered; });

	  g.transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	}
}

pymChild = new pym.Child({ renderCallback: drawGraphic});