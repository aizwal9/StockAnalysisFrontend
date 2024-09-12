import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const D3LineChart = ({ data, symbol }) => {
    const chartRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [tooltipData, setTooltipData] = useState(null); // State for tooltip data

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
        chart.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .append("path")
            .datum(data)
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
        </>
    );
};

export default D3LineChart;