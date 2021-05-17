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
    var svgWidth = window.innerWidth-400;
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
  
    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
    // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
        return xLinearScale;
    }

    // function used for updating x-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height,0]);
  
    return yLinearScale;
  
    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));

        return circlesGroup;
    }
    // Read CSV
    d3.csv("./assets/data/data.csv").then(function(healthData, err) {
        if (err) throw err;

        console.log(healthData)
        
        healthData.forEach(function(data) {
            data.healthcare = +data.healthcare;
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            data.income = +data.income;
          });
          
        //create xScale & yScale
        var xLinearScale = xScale(healthData, chosenXAxis);
        var yLinearScale = yScale(healthData, chosenYAxis);

        //create axes
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //append axes
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 20)
            .attr("fill", "pink")
            .attr("opacity", ".5");

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
            .attr("fill", "black")

        // Create group for two x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var healthcareLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("Poverty (%)");

        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age");

        // append y axis
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")
            
        var povertyLabel = ylabelsGroup.append("text")    
            .classed("axis-text", true)
            .attr("y", 0 - margin.left+12)
            .attr("x", 0 - (height / 2))
            .classed("active", true)
            .text("Healthcare (%)");

        }).catch(function(error) {
            console.log(error);
        });
    }
        
    // When the browser loads, makeResponsive() is called.
    makeResponsive();
    
    // When the browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive);