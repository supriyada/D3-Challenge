# D3-Challenge

### Overview:
The U.S. Census Bureau and the Behavioral Risk Factor Surveillance System's dataset is provided to analyse the various risk factors like age, poverty, income, smokes, obesity, healthcare, etc for all 51 states in U.S. The main part would be to create a basic scatter plot between two risk factors `Healthcare` and `Poverty`. In addition, we are free to add more complexity by adding more risk factors on both axes, interactive plot, animate the plot circles and add tool tip.

### Basic scatter plot:
> - By using the `d3.csv` function, data is read from the csv file.<br>
> - The scatter plot is created between two risk factors `Healthcare` and `Poverty`.<br>
> - The circles in the scatter plot represents each state in the dataset. <br>
> - Each state abbreviation is added in each circle.<br>
> - X axis & Y axis are created and placed in the bottom and left of the chart area respectively. The corresponding labels are also given. <br>
> - `python -m http.server` is used to run the visualization. This hosted the page at `localhost:8000` in the web browser.<br>
> - The window is made responsive as well.

### Interactive scatter plot:
> - Additional labels `age` & `income` in the x-axis and `smokes` & `obesity` in the y-axis are placed.<br>
> - The click event is given to these new labels so that users can decide which data to display. <br>
> - Whenever new factor is chosen, the circles in the plot moves to the new location creating a animated effect. The range of the axis is also updated accordingly. <br>
> - Tooltips are added as another layer to the plot. On moving cursor over the circle, the statename and the data of the chosen x-axis & y-axis pops-up.  
