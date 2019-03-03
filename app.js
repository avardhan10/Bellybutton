console.log('testing');

d3.json('/film_names').then(data => {
	console.log(data);
	data.forEach(row => d3.select('#dropdownmenu').append('option').attr("value", row.film_id).text(row.title));
});

d3.select('#clickme').on("click", function() {
	var film_id = d3.select('#dropdownmenu').property('value');
	d3.json(`/film_detail/${film_id}`).then(data => {
		d3.select('#header').text(`Movie ${data.title} has a rating of ${data.rating} and was released in ${data.release_year}.`);
	});
});





function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((data) => {
    // Using d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Using `.html("") to clear any existing metadata
    PANEL.html("");

    // Using `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key}: ${value}`);
    });
  
  });
}
  
function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [
      {
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];

   
    Plotly.plot("pie", pieData);
  });
}

function init() {
  // Grabbing a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // using a list of sample names to get the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Using first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Getting new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();