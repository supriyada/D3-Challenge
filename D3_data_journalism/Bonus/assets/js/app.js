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
    var svgWidth = window.innerWidth - 400;
    var svgHeight = window.innerHeight - 200;

    var margin = {
        top: 50,
        bottom: 100,
        right: 300,
        left: 200
    };

    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .attr("fill","#1e5934")

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // function used for updating x-scale var upon click on axis label
    function xScale(healthData, chosenXAxis) {
        // create scales
        if (chosenXAxis === "income") {
            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(healthData, d => d[chosenXAxis] - 500),
                d3.max(healthData, d => d[chosenXAxis] + 2000)
                ])
                .range([0, width]);
        }
        else {
            var xLinearScale = d3.scaleLinear()
                .domain([d3.min(healthData, d => d[chosenXAxis] - 0.5),
                d3.max(healthData, d => d[chosenXAxis] + 2)
                ])
                .range([0, width]);
        }
        return xLinearScale;
    }

    // function used for updating x-scale var upon click on axis label
    function yScale(healthData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(healthData, d => d[chosenYAxis] - 0.5),
            d3.max(healthData, d => d[chosenYAxis] + 2)
            ])
            .range([height, 0]);

        return yLinearScale;

    }

    /*function cScale(healthData){
        /*const colorScale = d3.scaleOrdinal()
                            
                            .domain([d3.min(healthData, d => d[chosenXAxis]),
                            d3.max(healthData, d => d[chosenXAxis])
                            ])
                            .range(d3.schemeCategory10)

        var colorScale = d3.scaleLinear().domain([d3.min(healthData, d => d[chosenXAxis]),
                                        d3.max(healthData, d => d[chosenXAxis])])
                            .range(["white", "blue"])

        return colorScale;
    }*/
    
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

    function renderText(text, newXScale, newYScale, chosenXAxis, chosenYAxis) {

        text.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]) + 4)
            .text(d => d.abbr)

        return text;
    }
    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

        var xlabel;
        var ylabel;
        var xvalue;
        var yvalue;
        function setValue(d){
        if (chosenXAxis === "income") {
            xlabel = "Income:";
            xvalue = d3.format("($,")(d.income)
        }
        else if (chosenXAxis === "age") {
            xlabel = "Age:";
            xvalue = `${d.age}`
        }
        else {
            xlabel = "Poverty:";
            xvalue = `${d.poverty}%`;
        
        //return xlabel, xvalue
        }
        if (chosenYAxis === "obesity") {
            ylabel = "Obesity:";
            yvalue = `${d.obesity}%`;
        }
        else if (chosenYAxis === "smokes") {
            ylabel = "Smokers:";
            yvalue = `${d.smokes}%`;
        }
        else {
            ylabel = "Healthcare:";
            yvalue = `${d.healthcare}%`;
        }
        }
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-8, 0])
            
            .html(function (d) {
                setValue(d)
                //return (`<strong>${d.state}</strong><br><br><strong>${xlabel}</strong> 
                //${xvalue}<br><strong>${ylabel}</strong> ${yvalue}`);
                return(`<h4>${d.state}</h4><strong>${xlabel}</strong> 
                ${xvalue}<br><br><strong>${ylabel}</strong> ${yvalue}<br>`)
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function (data) {
            
            d3.select(this)
                .attr("fill", "#ad0561")
                .attr("stroke", "black")
                .attr("stroke-width","2")
            toolTip.show(data);
        })
            // onmouseout event
            .on("mouseout", function (data) {
                d3.select(this)
                    .attr("fill", "#99577c")
                    .attr("stroke", "none")
                toolTip.hide(data);
            });

        return circlesGroup;
    }

    // Read CSV
    d3.csv("./assets/data/data.csv").then(function (healthData, err) {
        if (err) throw err;

        console.log(healthData)

        healthData.forEach(function (data) {
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
            // .attr("transform", `translate(40,-35)`)
            .call(leftAxis);
        
        var circlesGroup = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))            
            .attr("r", 12)
            .attr("class", "stateCircle")      
            

        var text = chartGroup.selectAll("all")
            .data(healthData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
            .text(d => d.abbr)
            .attr("class", "stateText")

        var titleText = chartGroup.append("text")
                                .attr("x", (width / 2))             
                                .attr("y", 0 - (margin.top / 2))
                                .attr("text-anchor", "middle")  
                                .style("font-size", "25px") 
                                .style("text-decoration", "underline")  
                                .text(" Graph");

                               

        // Create group for two x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 5})`);

        var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 30)
            .attr("value", "poverty") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty (%)");


        var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 50)
            .attr("value", "age") // value to grab for event listener
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 70)
            .attr("value", "income") // value to grab for event listener
            .classed("inactive", true)
            .text("Income (Median)");

        // append y axis
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("dy", "1em")

        var healthcareLabel = ylabelsGroup.append("text")
            .classed("axis-text", true)
            .attr("y", 0 - margin.left + 150)
            .attr("x", 0 - (height / 2))
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var smokerLabel = ylabelsGroup.append("text")
            .classed("axis-text", true)
            .attr("y", 0 - margin.left + 130)
            .attr("x", 0 - (height / 2))
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokers (%)");

        var ObesityLabel = ylabelsGroup.append("text")
            .classed("axis-text", true)
            .attr("y", 0 - margin.left + 110)
            .attr("x", 0 - (height / 2))
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obese (%)");

        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);


        // x axis labels event listener
        xlabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {


                    // replaces chosenXAxis with value
                    chosenXAxis = value;

                    console.log(chosenXAxis)


                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(healthData, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderXAxes(xLinearScale, xAxis);
                    // yAxis = renderYAxes(yLinearScale, yAxis);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                    text = renderText(text, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    //text = renderText(text, chosenXAxis, chosenYAxis)
                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenXAxis === "income") {
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                    else if (chosenXAxis === "age") {
                        povertyLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ageLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        povertyLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ageLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        incomeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                }

            });
        ylabelsGroup.selectAll("text")
            .on("click", function () {
                // get value of selection
                var yValue = d3.select(this).attr("value");
                if (yValue !== chosenYAxis) {

                    // replaces chosenXAxis with value
                    chosenYAxis = yValue;

                    console.log(chosenYAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    yLinearScale = yScale(healthData, chosenYAxis);

                    // updates x axis with transition
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                    text = renderText(text, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                    // updates tooltips with new info
                    // circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenYAxis === "healthcare") {
                        healthcareLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        smokerLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ObesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else if (chosenYAxis === "smokes") {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokerLabel
                            .classed("active", true)
                            .classed("inactive", false);
                        ObesityLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        healthcareLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        smokerLabel
                            .classed("active", false)
                            .classed("inactive", true);
                        ObesityLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }

            });


    }).catch(function (error) {
        console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);