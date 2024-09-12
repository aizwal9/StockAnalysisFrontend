import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const D3LineChart = ({ data, symbol }) => {
    const chartRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [tooltipData, setTooltipData] = useState(null); // State for tooltip data
    const [filteredData, setFilteredData] = useState(data); // State for filtered data
    const [timeFilter, setTimeFilter] = useState('all'); // State for time filter

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const createChart = () => {
        const chart = d3.select(chartRef.current);

        // Set chart dimensions
        //   margin = { top: 20, right: 20, bottom: 30, left: 40 };
        //   width = 960 - margin.left - margin.right;
        //   height = 500 - margin.top - margin.bottom;
        setChartWidth(width);

        // Create scales
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.close)])
            .range([height, 0]);

        // Create line generator
        const line = d3.line()
            .x(d => xScale(new Date(d.date)))
            .y(d => yScale(d.close));

        // Add chart elements
        chart.selectAll("path").remove(); // Remove existing path
        chart.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .append("path")
            .datum(filteredData) // Use filteredData
            .attr("d", line)
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("fill", "none");

        // Add axes
        chart.append("g")
            .attr("transform", `translate(${margin.left},${height + margin.top})`)
            .call(d3.axisBottom(xScale));

        chart.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(yScale));

        chart.append("text")
            .attr("x", (width / 2) + margin.left)
            .attr("y", margin.top - (margin.top / 2))
            .attr("text-anchor", "middle")
            .text(`${symbol} Closing Price`);


        // Add tooltip
        const tooltip = chart.append("g")
            .attr("class", "tooltip")
            .style("display", "none");

        tooltip.append("rect")
            .attr("width", 60)
            .attr("height", 20)
            .attr("fill", "white")
            .attr("stroke", "black")
            .style("opacity", 0.8);

        tooltip.append("text")
            .attr("x", 30)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px");

        // Mouseover/mouseout events
        chart.selectAll("path")
            .on("mouseover", (event, d) => {
                tooltip
                    .style("display", "block")
                    .attr("transform", `translate(${xScale(new Date(d.date)) + margin.left},${yScale(d.close) + margin.top})`);

                tooltip.select("text")
                    .text(`Price: $${d.close.toFixed(2)}`);

                setTooltipData(d); // Update state for tooltip data
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
                setTooltipData(null); // Reset tooltip state
            });
    };

    const filterData = (filter) => {
        setTimeFilter(filter);
        const filtered = filter === 'all' ? data : filterDataByTime(data, filter);
        setFilteredData(filtered);
    };

    const filterDataByTime = (data, filter) => {
        const now = new Date();
        let start;
        switch (filter) {
            case 'hour':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1); // Last hour
                break;
            case 'day':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1); // Yesterday
                break;
            case 'week':
                start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); // Start of week
                break;
            case 'month':
                start = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of last month
                break;
            case 'year':
                start = new Date(now.getFullYear() - 1, 0, 1); // Start of last year
                break;
            case '5year':
                start = new Date(now.getFullYear() - 5, 0, 1); // Start of 5 years ago
                break;
            default:
                return data; // Default to all data
        }

        return data.filter(d => new Date(d.date) >= start);
    };

    useEffect(() => {
        createChart();
    }, [data]);

    return (
        <>
            <svg ref={chartRef} width={chartWidth + margin.left + margin.right} height={height + margin.top + margin.bottom} />
            {tooltipData && (
                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                    <p>Date: {tooltipData.date}</p>
                    <p>Close Price: ${tooltipData.close.toFixed(2)}</p>
                </div>
            )}
            {/* Filter controls */}
            <div>
                <button onClick={() => filterData('all')}>All</button>
                <button onClick={() => filterData('hour')}>Hour</button>
                <button onClick={() => filterData('day')}>Day</button>
                <button onClick={() => filterData('week')}>Week</button>
                <button onClick={() => filterData('month')}>Month</button>
                <button onClick={() => filterData('year')}>Year</button>
                <button onClick={() => filterData('5year')}>5 Years</button>
            </div>
        </>
    );
};

export default D3LineChart;