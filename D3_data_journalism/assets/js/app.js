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
    var svgHeight = window.innerHeight-300;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
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
            .domain([d3.min(healthData, d => d.poverty)-1,d3.max(healthData, d => d.poverty)+2])
            .range([0, width]);
        var xLinearScale2 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.age))
            .range([0, width]);
        var xLinearScale3 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.income))
            .range([0, width]);

        var yLinearScale1 = d3.scaleLinear()
            .domain([d3.min(healthData, d => d.healthcare)-1,d3.max(healthData, d => d.healthcare)+2])
            .range([height, 0]);
        var yLinearScale2 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.smokes))
            .range([height, 0]);
        var yLinearScale3 = d3.scaleLinear()
            .domain(d3.extent(healthData, d => d.obesity))
            .range([height, 0]);

        //Create Axes
        var x1Axis = d3.axisBottom(xLinearScale1);
        var y1Axis = d3.axisLeft(yLinearScale1)//.ticks(6);

        var x2Axis = d3.axisBottom(xLinearScale2);
        var y2Axis = d3.axisLeft(yLinearScale2)//.ticks(6);

        var x3Axis = d3.axisBottom(xLinearScale3);
        var y3Axis = d3.axisLeft(yLinearScale3)//.ticks(6);
        
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
            .attr("fill","red")
            .attr("opacity", ".5")            

        var text = chartGroup.selectAll(null)
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale1(d.poverty))
            .attr("y", d => yLinearScale1(d.healthcare)+3)
            .attr("text-anchor", "middle")
            .text(d=>d.abbr)
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("fill", "black");
        //    
        //chartGroup.append("")

    }).catch(function(error) {
        console.log(error);
    });
}
    
// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);