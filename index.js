const margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },
    width = 445 - margin.right - margin.left,
    height = 445 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('trnsform',
        `translate(${margin.left}, ${margin.top})`);
//read data
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json").then(function (data) {

    // stratify the data: reformatting for d3.js
    console.log(data)
    const root = d3.hierarchy(data).sum(function (d) {
        return d.value
    }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    // The coordinates are added to the root object above
    d3.treemap()
        .size([width, height])
        .paddingTop(28)
        .paddingRight(7)
        .paddingInner(3)
        (root)

    // prepare a color scale
    const color = d3.scaleOrdinal()
        .domain(['boss1', 'boss2', 'boss3'])
        .range(["#402D54", "#D18975", "#8FD175"]);

    // And a opacity scale
    const opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([.5, 1])

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr('x', function (d) {
            return d.x0;
        })
        .attr('y', function (d) {
            return d.y0;
        })
        .attr('width', function (d) {
            return d.x1 - d.x0;
        })
        .attr('height', function (d) {
            return d.y1 - d.y0;
        })
        .style("stroke", "black")
        .style("fill", function (d) {
            return color(d.parent.data.name)
        })
        .style('opacity', function (d) {
            return opacity(d.data.value)
        })

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .join("text")
        .attr("x", function (d) {
            return d.x0 + 5
        }) // +10 to adjust position (more right)
        .attr("y", function (d) {
            return d.y0 + 20
        }) // +20 to adjust position (lower)
        .text(function (d) {
            return d.data.name.replace('mister_', '')
        })
        .attr("font-size", "19px")
        .attr("fill", "white");

    svg
        .selectAll("vals")
        .data(root.leaves())
        .join("text")
        .attr("x", function (d) {
            return d.x0 + 5
        }) // +10 to adjust position (more right)
        .attr("y", function (d) {
            return d.y0 + 35
        }) // +20 to adjust position (lower)
        .text(function (d) {
            return d.data.value
        })
        .attr("font-size", "11px")
        .attr("fill", "white");

    // add title
    svg
        .selectAll("titles")
        .data(root.descendants().filter(function (d) {
            return d.depth == 1
        }))
        .enter()
        .append("text")
        .attr("x", function (d) {
            return d.x0
        })
        .attr("y", function (d) {
            return d.y0 + 21
        })
        .text(function (d) {
            return d.data.name
        })
        .attr("font-size", "19px")
        .attr("fill", function (d) {
            return color(d.data.name)
        })

    svg.append('text')
        .attr('x', 0)
        .attr('y', 14) //+20 to adjust position (lower)
        .text("Three group leaders and 14 employees")
        .attr('font-size', '19px')
        .attr('fill', 'grey')


})