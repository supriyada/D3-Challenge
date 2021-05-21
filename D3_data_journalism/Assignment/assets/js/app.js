// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight - 200;

    var margin = {
        top: 50,
        bottom: 100,
        right: 600,
        left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select(".chart")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV
    d3.csv("./assets/data/data.csv").then(function(healthData) {
        console.log(healthData)
        
        healthData.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            data.income = +data.income;
          });

        //Create scales
        var xLinearScale1 = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.poverty)-1,d3.max(healthData, d => d.poverty)+1])
            .range([0, width]);
       
        var yLinearScale1 = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.healthcare)-1,d3.max(healthData, d => d.healthcare)+2])
            .range([height, 0]);
        
        //Create Axes
        var x1Axis = d3.axisBottom(xLinearScale1).ticks(18);
        var y1Axis = d3.axisLeft(yLinearScale1).ticks(14); 
        
        //Append axes to the group
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(x1Axis);
        chartGroup.append("g")
            .call(y1Axis);

        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx",d => xLinearScale1(d.poverty))
            .attr("cy",d => yLinearScale1(d.healthcare))
            .attr("r", "10")
            .attr("class","stateCircle")           

        var text = chartGroup.selectAll(null)
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale1(d.poverty))
            .attr("y", d => yLinearScale1(d.healthcare)+3)
            .text(d=>d.abbr)
            .attr("class","stateText")

        //Axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 5)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lack of healthcare %");

        chartGroup.append("text")
            .attr("transform", `translate(${(width / 2)-margin.left + 5}, ${height + margin.top-10})`)
            .attr("class", "axisText")
            .text("Poverty %");
        
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, -60])
            .html(function(d) {
              return (`<h5>${d.state}</h5>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
            });
      
          // Step 7: Create tooltip in the chart
          // ==============================
          chartGroup.call(toolTip);
      
          // Step 8: Create event listeners to display and hide the tooltip
          // ==============================
          circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
          })
            // onmouseout event
            .on("mouseout", function(data, index) {
              toolTip.hide(data);
            });

    }).catch(function(error) {
        console.log(error);
    });
}
    
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);