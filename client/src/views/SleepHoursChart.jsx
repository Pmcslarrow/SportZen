import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SleepHoursChart = ({ sleepData }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!sleepData) {
      return;
    }

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 400 - margin.left - margin.right; // Adjust the width as needed
    const height = 275 - margin.top // Adjust the height as needed

    // Clear any existing content within the chartRef
    d3.select(chartRef.current).selectAll('*').remove();

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
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3
          .axisLeft(y)
          .tickFormat((d) => (d > 0 ? d : '')) // Format ticks to display only positive values
      );

    return () => {
      // Cleanup when the component is unmounted
      svg.selectAll('*').remove();
    };
  }, [sleepData]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={chartRef}></div>
  );
};

export default SleepHoursChart;
