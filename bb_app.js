function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(samples) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var table = d3.select("#sample-metadata")
  
    // Use `.html("") to clear any existing metadata
    table.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(samples).forEach(([key, value]) => {
      var cell = table.append("p");
      cell.text(`${key}: ${value}`);
    });
    
    // BONUS: Build the Gauge Chart
    // buildGauge(samples.WFREQ);
    trace1 = {
      hole: 0.4, 
      type: 'pie', 
      marker: {
        colors: ['', '', '', '', '', '', '', '', '', 'white'], 
      }, 
      textsrc: 'bigpimpatl:3:3b66ba', 
      text: ['0-1', '2', '3', '4', '5', '6', '7', '8', '9'], 
      rotation: 90, 
      textinfo: 'text', 
      direction: 'clockwise', 
      valuessrc: 'bigpimpatl:3:05daaa', 
      values: [9, 9, 9, 9, 9, 9, 9, 9, 9, 81], 
      showlegend: false, 
      textposition: 'inside'
    };

    
    data = [trace1];
    
    needle = {
      x: [.20, .20, .25, .30, .38, .50, .62, .70, .75, .80], 
      y: [.56, .56, .66, .76, .86, .86, .86, .76, .66, .56]
    };

    layout = {
      title: `<b>Bell Button Washing Frequency</b> <br> Scrubs per Week`, 
      xaxis: {
        range: [-1, 1], 
        visible: false
      }, 
      yaxis: {
        range: [-1, 1], 
        visible: false
      }, 
      shapes: [
        {
          x0: 0.5, //bottom of line right or left
          x1: needle.x[samples.WFREQ], //top of line right or left
          y0: 0.5, //bottom of line up of down
          y1: needle.y[samples.WFREQ], //top of line up or down
          line: {
            color: 'black', 
            width: 3
          }, 
          type: 'line'
        }
      ], 
      autosize: true,
      hovermode: false
    };
    Plotly.newPlot("gauge", data, layout, {displayModeBar: false});
  });
}




function buildCharts(sample) {
  var url = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(samples) {
      // @TODO: Build a Bubble Chart using the sample data
    var data = [{
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
        color: samples.otu_ids,
        size: samples.sample_values
      },
      hovertext: samples.otu_labels.slice(0,10),
      hoverinfo: "x+y+text"
    }];

    var layout = {
      height: 600,
      width: 1400, 
      showlegend: false,
      hovermode:'closest',
      xaxis: {
        title: "OTU ID"
      },
    };

    Plotly.newPlot("bubble", data, layout);  

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: samples.sample_values.slice(0,10),
      labels: samples.otu_ids.slice(0,10),
      type: "pie",
      hovertext: samples.otu_labels.slice(0,10),
      hoverinfo: "text+value"
    }];  
    
    var layout = {
      height: 400,
      width: 500,
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0
      }
    };

    Plotly.newPlot("pie", data, layout, {displayModeBar: false});
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();