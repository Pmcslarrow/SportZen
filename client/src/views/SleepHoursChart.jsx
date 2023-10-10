import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SleepHoursChart = ({ sleepData }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!sleepData || !chartRef.current) {
      return;
    }

    // Clear any existing content within the chartRef
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const aspectRatio = 4 / 3; // Desired aspect ratio
    const containerWidth = chartRef.current.clientWidth;
    const maxWidth = 400; // Adjust the maximum width as needed
    const width = Math.min(containerWidth, maxWidth) - margin.left - margin.right;
    const height = width / aspectRatio - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(Object.keys(sleepData))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(sleepData))])
      .nice()
      .range([height, 0]);

    svg
      .selectAll('.bar')
      .data(Object.entries(sleepData))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d[0]))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => height - y(d[1]))
      .style('fill', 'steelblue');

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(x.domain().filter((d, i) => i % 2 === 0)) // Display every other label
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '9px');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d, i) => (i % 2 === 0 && d > 0 ? d : '')) // Display every other positive y-axis tick
      )
      .style('font-size', '9px');
  }, [sleepData]);

  return <div style={{ width: '100%', maxWidth: '400px' }} ref={chartRef}></div>;
};

export default SleepHoursChart;
