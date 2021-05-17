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
  
    // Initial Params
    var chosenXAxis = "healthcare";
    var chosenYAxis = "poverty";

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


        }).catch(function(error) {
            console.log(error);
        });
    }
        
    // When the browser loads, makeResponsive() is called.
    makeResponsive();
    
    // When the browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive);