import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const SleepHoursChart = ({ sleepData }) => {
  const chartRef = useRef();
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!sleepData) {
      return;
    }

    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const aspectRatio = 4 / 3; // Desired aspect ratio

    const updateDimensions = () => {
      const containerWidth = chartRef.current.clientWidth;
      const maxWidth = 400; // Adjust the maximum width as needed
      const width = Math.min(containerWidth, maxWidth) - margin.left - margin.right;
      const height = width / aspectRatio - margin.top - margin.bottom;

      setChartDimensions({ width, height });
    };

    // Initial dimensions setup
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Clear any existing content within the chartRef
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', chartDimensions.width + margin.left + margin.right)
      .attr('height', chartDimensions.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(Object.keys(sleepData))
      .range([0, chartDimensions.width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(sleepData))])
      .nice()
      .range([chartDimensions.height, 0]);

    svg
      .selectAll('.bar')
      .data(Object.entries(sleepData))
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d[0]))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => chartDimensions.height - y(d[1]))
      .style('fill', 'steelblue');

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartDimensions.height})`)
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
      window.removeEventListener('resize', updateDimensions);
      svg.selectAll('*').remove();
    };
  }, [sleepData, chartDimensions]);

  return (
    <div style={{ width: '100%', maxWidth: '400px' }} ref={chartRef}></div>
  );
};

export default SleepHoursChart;
