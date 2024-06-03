function _1(md){return(
md`# Charts`
)}

function _2(htl){return(
htl.html`<!DOCTYPE html>
<html>
<head>
  <center><b><font size="+2">Country of Origin</font></b></center>
  <style>
        body {
            background-color: #f0f0f0; /* Set default page color */
        }

        .page-color-blue {
            background-color: #3498db; /* Blue color */
        }

        .page-color-green {
            background-color: #2ecc71; /* Green color */
        }

        .page-color-yellow {
            background-color: #f1c40f; /* Yellow color */
        }

        /* Adjust text color for better readability */
        .content {
            color: #fff;
        }
    </style>
</head>
<body>
    <center><b><font size="+8"></font></b></center>

    <!-- Page content -->
    <div class="content page-color-blue">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- Another page content with a different color -->
    <div class="content page-color-green">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- You can add more page content with different colors as needed -->

</body>
</html>`
)}

async function _chart(FileAttachment,d3)
{
  const data = await FileAttachment("User_Store_History.csv").csv({ typed: true });

  // Specify the chart’s dimensions.
  const width = 1000;
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

  // Group data by Country and count store_name for each group.
  const groupedData = Array.from(
    d3.rollup(
      data,
      (v) => v.length,
      (d) => d.Country
    )
  );

  // Calculate total store_name count.
  const totalStoreName = d3.sum(groupedData, (d) => d[1]);

  // Calculate percentages for each country.
  groupedData.forEach((d) => {
    d.push((d[1] / totalStoreName) * 100);
  });

  // Define custom blueish color codes.
  const blueishColors = [
    "#0096c7",  // Light Dark blue
    "#023e8a", // Dark blue
    "#0077b6", // Light medium blue 
    "#a9d6e5", // Lighter blue
    "#6baed6", // Medium blue
    "#bbdefb", // Light blue
  ];

  // Define color scale with custom blueish colors.
  const color = d3.scaleOrdinal()
    .domain(groupedData.map((d) => d[0]))
    .range(blueishColors);

  // Create the pie layout.
  const pie = d3.pie()
    .sort(null)
    .value((d) => d[1]);

  // Define arc generator.
  const arc = d3.arc()
    .innerRadius(radius * 0.2)
    .outerRadius(radius * 1.0)
    .cornerRadius(10)
    .padAngle(0.02);

  // Create SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif;");

  // Create a group for the arcs.
  const arcsGroup = svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(pie(groupedData))
    .join("path")
    .attr("fill", (d) => color(d.data[0]))
    .attr("d", arc)
    .append("title")
    .text((d) => `<tspan font-weight="bold">${d.data[0]}:</tspan> <tspan font-weight="bold">${d.data[2].toFixed(2)}%</tspan>`);

  // Create a group for the labels.
  const labelsGroup = svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pie(groupedData))
    .join("text")
    .attr("transform", (d) => {
      const pos = arc.centroid(d);
      pos[1] -= 8; // Move text slightly above
      return `translate(${pos})`;
    })
    .style("font-size", "15px") // Increased font size to 15px
    .call((text) =>
      text.filter((d) => d.endAngle - d.startAngle > 0.25)
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .attr("font-weight", "bold")
        .text((d) => d.data[0])
        .append("tspan")
        .attr("x", 0)
        .attr("y", "2.0em") // Increased y-value for more space
        .attr("fill-opacity", 0.7)
        .attr("font-weight", "bold")
        .text((d) => `${d.data[2].toFixed(2)}%`)
    );

  // Zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on("zoom", (event) => {
      const { transform } = event;
      transform.x = 0; // Reset x translation
      transform.y = 0; // Reset y translation
      svg.attr("transform", transform);
    });

  svg.call(zoom);

  // Create container for zoom slider and SVG
  const container = d3.create("div")
    .style("position", "relative");

  // Create zoom slider container
  const zoomSliderContainer = container.append("div")
    .style("position", "absolute")
    .style("left", "10px")
    .style("bottom", "10px")
    .style("background", "#f0f0f0") // Optional: Add background for better visibility
    .style("padding", "5px") // Optional: Add padding
    .style("border-radius", "5px") // Optional: Add border radius
    .style("width", "75px"); // Reduce the width of the slider container to half

  // Create zoom slider
  const zoomLabel = zoomSliderContainer.append("label")
    .attr("for", "zoom-slider")
    .text("")
    .style("margin-right", "5px");

  const zoomSlider = zoomSliderContainer.append("input")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", 5)
    .attr("step", 0.1)
    .attr("value", 1)
    .attr("id", "zoom-slider")
    .style("width", "50px"); // Reduce the width of the slider to half

  zoomSlider.on("input", function() {
    const scale = +this.value;
    svg.transition().duration(200).call(zoom.scaleTo, scale);
  });

  // Append SVG to container
  container.append(() => svg.node());

  // Return the container node
  return container.node();
}


function _4(htl){return(
htl.html`<!DOCTYPE html>
<html>
<head>
  <center><b><font size="+2">Retailer wise Material</font></b></center>
  <style>
        body {
            background-color: #f0f0f0; /* Set default page color */
        }

        .page-color-blue {
            background-color: #3498db; /* Blue color */
        }

        .page-color-green {
            background-color: #2ecc71; /* Green color */
        }

        .page-color-yellow {
            background-color: #f1c40f; /* Yellow color */
        }

        /* Adjust text color for better readability */
        .content {
            color: #fff;
        }
    </style>
</head>
<body>
    <center><b><font size="+8"></font></b></center>

    <!-- Page content -->
    <div class="content page-color-blue">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- Another page content with a different color -->
    <div class="content page-color-green">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- You can add more page content with different colors as needed -->

</body>
</html>`
)}

async function _chart1(FileAttachment,d3)
{
  // Load data from file attachment.
  const data = await FileAttachment("User_Store_History.csv").csv({ typed: true });

  // Get unique materials for the dropdown
  const materials = Array.from(new Set(data.map(d => d.Material)));

  // Specify the chart’s dimensions.
  const width = 1000;
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

  // Define your custom color scheme with shades of blue
  const customBlueScheme = ['#08306b', '#08519c', '#9ecae1', '#08519c', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'];

  // Define the color scale using the custom color scheme
  const color = d3.scaleOrdinal().range(customBlueScheme);

  // Create SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif;");

  // Create the pie layout.
  const pie = d3.pie()
    .sort(null)
    .value((d) => d.percentage);

  // Define arc generator.
  const arc = d3.arc()
    .innerRadius(radius * 0.2) // Adjust inner radius to provide more space for text
    .outerRadius(radius * 1.0)
    .cornerRadius(10)
    .padAngle(0.02);

  // Container for all elements
  const container = d3.create("div");

  // Add a label for the dropdown
  const label = container.append("label")
    .attr("for", "material-dropdown")
    .text("Materials")
    .style("margin-right", "10px");

  // Dropdown for selecting Material
  const dropdown = container.append("select")
    .attr("id", "material-dropdown");

  // Add options to the dropdown from unique materials
  dropdown.selectAll("option")
    .data(materials)
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  // Function to detect label collisions
  function detectCollision(label, index, labels) {
    if (index === 0) return; // No need to check for the first label

    const labelNode = label.node();
    const labelBox = labelNode.getBBox();
    const labelX = labelBox.x + labelBox.width / 2;
    const labelY = labelBox.y + labelBox.height / 2;

    labels.each(function(d, i) {
      if (i < index) {
        const prevLabel = d3.select(this);
        const prevLabelNode = prevLabel.node();
        const prevLabelBox = prevLabelNode.getBBox();
        const prevLabelX = prevLabelBox.x + prevLabelBox.width / 2;
        const prevLabelY = prevLabelBox.y + prevLabelBox.height / 2;

        const dx = labelX - prevLabelX;
        const dy = labelY - prevLabelY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Adjust label position if collision detected
        if (distance < 20) { // Adjust this threshold as needed
          const moveX = 20 * dx / distance;
          const moveY = 20 * dy / distance;
          label.attr("transform", `translate(${labelX + moveX},${labelY + moveY})`);
        }
      }
    });
  }

  // Function to update the chart based on selected material
  function update(material) {
    // Filter data based on selected material
    const filteredData = data.filter(d => d.Material === material)
      .reduce((acc, d) => {
        acc[d.Retailer_name] = (acc[d.Retailer_name] || 0) + 1;
        return acc;
      }, {});

    // Transform the data into an array suitable for pie chart
    const pieData = Object.entries(filteredData)
      .map(([key, value]) => ({
        name: key,
        percentage: (value / data.length) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage in descending order
      .slice(0, 5); // Keep only top 5

    // Update paths in the pie chart
    const arcsGroup = svg.selectAll("path")
      .data(pie(pieData), d => d.data.name);

    arcsGroup.enter().append("path")
      .merge(arcsGroup)
      .attr("fill", (d, i) => color(i))
      .attr("d", arc)
      .select("title").text(d => `${d.data.name}: ${d.data.percentage.toFixed(2)}%`);

    arcsGroup.exit().remove();

    // Update text labels inside arcs
    const textGroup = svg.selectAll("g")
      .data(pie(pieData), d => d.data.name);

    const textEnter = textGroup.enter().append("g")
      .merge(textGroup)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle");

    const textLabels = textEnter.selectAll("text")
      .data(d => [d.data.name, `${d.data.percentage.toFixed(2)}%`]);

    textLabels.enter().append("text")
      .merge(textLabels)
      .attr("dy", (d, i) => i === 0 ? "-0.2em" : "1.4em")
      .style("font-size", (d, i) => i === 0 ? "15px" : "13px")
      .style("font-weight", "bold")
      .text(d => d)
      .each(function (d, i) {
        detectCollision(d3.select(this), i, textEnter.selectAll("text"));
      });

    textGroup.exit().remove();
  }

  // Initial chart update
  update(materials[0]); // Update chart with first material as default

  // Update chart when dropdown selection changes
  dropdown.on("change", function(event) {
    update(d3.select(this).property('value'));
  });

  // Zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on("zoom", (event) => {
      const { transform } = event;
      transform.x = 0; // Reset x translation
      transform.y = 0; // Reset y translation
      svg.attr("transform", transform);
    });

  svg.call(zoom);

  // Create zoom slider container
  const zoomSliderContainer = container.append("div")
    .style("position", "absolute")
    .style("left", "10px")
    .style("bottom", "10px")
    .style("background", "#f0f0f0") // Optional: Add background for better visibility
    .style("padding", "5px") // Optional: Add padding
    .style("border-radius", "5px") // Optional: Add border radius
    .style("width", "75px"); // Reduce the width of the slider container to half

  // Create zoom slider
  const zoomLabel = zoomSliderContainer.append("label")
    .attr("for", "zoom-slider")
    .text(" ")
    .style("margin-right", "5px");

  const zoomSlider = zoomSliderContainer.append("input")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", 5)
    .attr("step", 0.1)
    .attr("value", 1)
    .attr("id", "zoom-slider")
    .style("width", "50px"); // Reduce the width of the slider to half

  zoomSlider.on("input", function() {
    const scale = +this.value;
    svg.transition().duration(200).call(zoom.scaleTo, scale);
  });

  // Initial chart update
  update(materials[0]); // Update chart with first material as default

  // Update chart when dropdown selection changes
  dropdown.on("change", function(event) {
    update(d3.select(this).property('value'));
  });

  // Append SVG to container
  container.append(() => svg.node());

  // Return the container node
  return container.node();
}


function _6(htl){return(
htl.html`<!DOCTYPE html>
<html>
<head>
  <center><b><font size="+2">Average Price of Product Category</font></b></center>
  <style>
        body {
            background-color: #f0f0f0; /* Set default page color */
        }

        .page-color-blue {
            background-color: #3498db; /* Blue color */
        }

        .page-color-green {
            background-color: #2ecc71; /* Green color */
        }

        .page-color-yellow {
            background-color: #f1c40f; /* Yellow color */
        }

        /* Adjust text color for better readability */
        .content {
            color: #fff;
        }
    </style>
</head>
<body>
    <center><b><font size="+8"></font></b></center>

    <!-- Page content -->
    <div class="content page-color-blue">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- Another page content with a different color -->
    <div class="content page-color-green">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- You can add more page content with different colors as needed -->

</body>
</html>`
)}

async function _chart2(FileAttachment,d3)
{
  // Load data from file attachment.
  const data = await FileAttachment("User_Store_History.csv").csv({ typed: true });

  // Specify the chart’s dimensions.
  const width = 1000;
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

  // Group data by Product_category and calculate count, average price, and percentage.
  const groupedData = Array.from(
    d3.rollup(
      data,
      (v) => {
        const count = v.length;
        const totalPrice = d3.sum(v, (d) => d.Price);
        const averagePrice = totalPrice / count;
        const percentage = (count / data.length) * 100;
        return {
          count,
          averagePrice,
          percentage
        };
      },
      (d) => d.Product_category
    )
  )
    .sort((a, b) => b[1].count - a[1].count) // Sort by count in descending order
    .slice(0, 10); // Take only the top 10 categories

  // Define your custom color scheme with shades of blue
  const customBlueScheme = ['#08306b', '#08519c', '#9ecae1', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#deebf7'];

  // Define the color scale using the custom color scheme
  const color = d3.scaleOrdinal().range(customBlueScheme);

  // Create SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif;");

  // Create the pie layout.
  const pie = d3.pie()
    .sort(null)
    .value((d) => d[1].count);

  // Define arc generator.
  const arc = d3.arc()
    .innerRadius(radius * 0.2) // Adjust inner radius to provide more space for text
    .outerRadius(radius * 1.0)
    .cornerRadius(10)
    .padAngle(0.02);

  // Container for all elements
  const container = d3.create("div")
    .style("position", "relative")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center");

  // Create groups for arcs.
  svg.append("g")
    .attr("stroke", "white")
    .selectAll("path")
    .data(pie(groupedData))
    .join("path")
    .attr("fill", (d) => color(d.data[0]))
    .attr("d", arc)
    .append("title")
    .text((d) => {
      const categoryName = d.data[0];
      const percentage = d.data[1].percentage;
      const averagePrice = d.data[1].averagePrice;
      return `Category: ${categoryName}\nPercentage: ${
        percentage ? percentage.toFixed(2) : "N/A"
      }%\nAverage Price: ${averagePrice ? averagePrice.toFixed(2) : "N/A"}`;
    });

  // Add labels with category name, average price, and percentage inside the pie chart.
  const textGroup = svg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(pie(groupedData))
    .join("g")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`);

  textGroup.append("text")
    .attr("dy", "-1em")
    .style("font-size", "14px")  // Increased font size
    .style("font-weight", "bold")
    .text(d => d.data[0]);

  textGroup.append("text")
    .attr("dy", "0.2em")
    .style("font-size", "14px")  // Increased font size
    .style("font-weight", "bold")
    .text(d => `Percent: ${d.data[1].percentage.toFixed(2)}%`);

  textGroup.append("text")
    .attr("dy", "1.4em")
    .style("font-size", "14px")  // Increased font size
    .style("font-weight", "bold")
    .text(d => `Avg Price: $${d.data[1].averagePrice.toFixed(2)}`);

  // Zoom functionality
  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .on("zoom", (event) => {
      const { transform } = event;
      transform.x = 0; // Reset x translation
      transform.y = 0; // Reset y translation
      svg.attr("transform", transform);
    });

  svg.call(zoom);

  // Create zoom slider container
  const zoomSliderContainer = container.append("div")
    .style("position", "absolute")
    .style("left", "10px")
    .style("bottom", "10px")
    .style("background", "#f0f0f0") // Optional: Add background for better visibility
    .style("padding", "5px") // Optional: Add padding
    .style("border-radius", "5px") // Optional: Add border radius
    .style("width", "75px"); // Reduce the width of the slider container to half

  // Create zoom slider
  const zoomLabel = zoomSliderContainer.append("label")
    .attr("for", "zoom-slider")
    .text("")
    .style("margin-right", "5px");

  const zoomSlider = zoomSliderContainer.append("input")
    .attr("type", "range")
    .attr("min", 1)
    .attr("max", 5)
    .attr("step", 0.1)
    .attr("value", 1)
    .attr("id", "zoom-slider")
    .style("width", "50px"); // Reduce the width of the slider to half

  zoomSlider.on("input", function() {
    const scale = +this.value;
    svg.transition().duration(200).call(zoom.scaleTo, scale);
  });

  // Append SVG to container
  container.append(() => svg.node());

  // Return the container node
  return container.node();
}


function _8(htl){return(
htl.html`<!DOCTYPE html>
<html>
<head>
  <center><b><font size="+2">Country Wise Store</font></b></center>
  <style>
        body {
            background-color: #f0f0f0; /* Set default page color */
        }

        .page-color-blue {
            background-color: #3498db; /* Blue color */
        }

        .page-color-green {
            background-color: #2ecc71; /* Green color */
        }

        .page-color-yellow {
            background-color: #f1c40f; /* Yellow color */
        }

        /* Adjust text color for better readability */
        .content {
            color: #fff;
        }
    </style>
</head>
<body>
    <center><b><font size="+8"></font></b></center>

    <!-- Page content -->
    <div class="content page-color-blue">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- Another page content with a different color -->
    <div class="content page-color-green">
        <!-- Your content goes here -->
        <p> </p>
    </div>

    <!-- You can add more page content with different colors as needed -->

</body>
</html>`
)}

function* _map(htl,L)
{
  const container = yield htl.html`<div style="height: 500px;">`;
const map = L.map(container).setView([37.774, -122.423], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors"
}).addTo(map);

let isFirstLook = true; // Flag to track if it's the first look at the United States map

// Dummy data with country-wise store names and country coordinates
const storeData = {
  "UnitedStates": {
    "stores": [
      "Berlington",
      "Ross",
      "Big Lots",
      "Home Goods",
      "JC Penny",
      "Kohls",
      "Macy's",
      "Sam's Club",
      "TZX",
      "Walmart"
    ],
    "coords": [
      [34.0522, -118.2437],
      [37.7749, -122.4194],
      [32.7157, -117.1611],
      [36.0194, -119.4912],
      [25.7617, -80.1918],
      [25.7907, -80.1300],
      [38.7749, -121.4194],
      [31.7157, -116.1611],
      [27.9506, -82.4572],
      [26.1224, -80.1373],
      [27.3364, -82.5307],
      [35.9506, -81.4572]
    ]
    // Los Angeles, California (assumed)
  }
}

// Add coordinates for other countries
// Iterate through store data and add markers to the map
Object.entries(storeData).forEach(([country, data]) => {
  const stores = data.stores;
  const storeCoords = data.coords;

  stores.forEach((store, index) => {
    const [storeLat, storeLng] = storeCoords[index];
    const marker = L.marker([storeLat, storeLng]).addTo(map);
    
    if (country === "UnitedStates" && isFirstLook) {
      marker.bindPopup(`<b>${store}</b>`); // Only show store name on the first look of United States map
    } else {
      marker.bindPopup(`<b>${store}</b><br>${country}`);
    }
  });

  if (country === "UnitedStates" && isFirstLook) {
    isFirstLook = false; // Update the flag after the first look
  }
});

// Create a dropdown menu for country selection
const dropdown = document.createElement('select');
Object.keys(storeData).forEach(country => {
  const option = document.createElement('option');
  option.value = country;
  option.textContent = country;
  dropdown.appendChild(option);
});

// Add event listener to handle country selection
dropdown.addEventListener('change', (event) => {
  const selectedCountry = event.target.value;
  // You can implement logic here to change the map view or show/hide markers based on the selected country
});

// Add the dropdown menu to the HTML body
document.body.appendChild(dropdown);
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["User_Store_History.csv", {url: new URL("./files/df5fbe03d6e154d7eedc55ef48b6d8b559690d21548674502c76138ffb5d12a63690ed1202eeb726fac63baeb1c801656aaededac632a54df7cb394ee74fd063.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["htl"], _2);
  main.variable(observer("chart")).define("chart", ["FileAttachment","d3"], _chart);
  main.variable(observer()).define(["htl"], _4);
  main.variable(observer("chart1")).define("chart1", ["FileAttachment","d3"], _chart1);
  main.variable(observer()).define(["htl"], _6);
  main.variable(observer("chart2")).define("chart2", ["FileAttachment","d3"], _chart2);
  main.variable(observer()).define(["htl"], _8);
  main.variable(observer("map")).define("map", ["htl","L"], _map);
  return main;
}
