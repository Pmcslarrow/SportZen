import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';

const SleepHoursChart = ({ sleepData, performanceData, averages, selectedPlayer }) => {
  const chartRef = useRef();

// If the selected user is "All Players" average the values out 0-10
  const calculateAverageSleepHours = () => {
    if (selectedPlayer === "All Players") {
      const averageSleepHours = {};

      for (const date in averages.sleepHours) {
        if (averages.sleepHours[date].count > 0) {
          averageSleepHours[date] = averages.sleepHours[date].sum / averages.sleepHours[date].count;
        }
      }

      return averageSleepHours;
    } else {
      return sleepData;
    }
  };

  const DATA = useMemo(calculateAverageSleepHours, [selectedPlayer, sleepData, averages]);


  useEffect(() => {
    if (!DATA || !chartRef.current) {
      return;
    }

    // Sort the data by date
    const sortedSleepData = sortDataByDate(DATA);
    const sortedPerformanceData = sortDataByDate(performanceData);

    // Match and preprocess the data
    const matchedData = matchAndPreprocessData(sortedSleepData, sortedPerformanceData);

    const containerWidth = chartRef.current.clientWidth;
    const margin = { top: 60, right: 20, bottom: 50, left: 40 };
    const aspectRatio = 4 / 3;

    const width = containerWidth - margin.left - margin.right
    const height = width / aspectRatio - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(matchedData.map((d) => d.date))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(matchedData.map((d) => d.hours))])
      .nice()
      .range([height, 0]);

    const colorScale = d3
      .scaleSequential((t) => d3.interpolateLab("#004E98", "white")(1 - t))
      .domain([0, 10]); // Adjust the domain based on your ratings

    svg
      .selectAll('.bar')
      .data(matchedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.hours))
      .attr('height', (d) => height - y(d.hours))
      .style('fill', (d) => colorScale(d.rating / 10)); // Normalize the rating to [0, 1]

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(x.domain().filter((d, i) => i % 2 === 0))
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
          .tickFormat((d, i) => (i % 2 === 0 && d > 0 ? d : ''))
      )
      .style('font-size', '9px');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Hours of Sleep per Day');

    createLegend()
  }, []); // Empty dependency array to run the effect only on mount

  const createLegend = () => {
    // Create a legend SVG element
    const legendWidth = 100;
    const legendHeight = 300;
    const legendSvg = d3.select('#legend-container')
      .append('svg')
      .attr('width', legendWidth)
      .attr('height', legendHeight);

    // Define the color scale for the legend
    const legendColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(['#004E98', 'white']);

    // Create a gradient in the legend
    const defs = legendSvg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    linearGradient.append('stop')
      .attr('offset', '0%')
      .style('stop-color', legendColorScale(0));

    linearGradient.append('stop')
      .attr('offset', '100%')
      .style('stop-color', legendColorScale(1));

    // Add the legend rectangle with the gradient
    legendSvg.append('rect')
      .attr('width', 20)
      .attr('height', 250)
      .attr('fill', 'url(#legend-gradient)');

    // Add labels to the legend
    legendSvg.append('text')
      .attr('x', 30)
      .attr('y', 20)
      .text('High Performance')
      .style('font-size', '12px')
      .style('fill', 'black');

    legendSvg.append('text')
      .attr('x', 30)
      .attr('y', 250)
      .text('Low Performance')
      .style('font-size', '12px')
      .style('fill', 'black');
  };
  
  const sortDataByDate = (data) => {
    return Object.entries(data).sort((a, b) => {
      return new Date(a[0]) - new Date(b[0]);
    });
  };

  const matchAndPreprocessData = (sleepData, performanceData) => {
    // Match and preprocess the data
    const matchedData = [];
    sleepData.forEach(([date, hours]) => {
      const performanceRating = performanceData.find(([pDate]) => pDate === date);
      if (performanceRating) {
        matchedData.push({ date, hours, rating: performanceRating[1] });
      }
    });

    return matchedData;
  };

  const PerformanceLegend = ({ colorHex }) => {
    // Define the color scale for the legend
    const legendColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([colorHex, 'white']); // Adjust the range based on your color
  
    // Create a gradient in the legend
    const linearGradientId = `legend-gradient-${colorHex}`;
    
    return (
      <div>
        <p style={{
          fontSize: '14px', // Note that camelCase is used for CSS properties
        }}>
          High Performance
        </p>
        <svg width="20" height="150">
          <defs>
            <linearGradient id={linearGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={legendColorScale(0)} />
              <stop offset="100%" stopColor={legendColorScale(1)} />
            </linearGradient>
          </defs>
          <rect width="20" height="250" fill={`url(#${linearGradientId})`} />
        </svg>
        <p style={{
          fontSize: '14px', // Note that camelCase is used for CSS properties
        }}>
          Low Performance
        </p>
      </div>
    );
  };

  return(
    <>
    <div style={{ width: '100%', maxWidth: '400px' }} ref={chartRef}></div>
    <PerformanceLegend colorHex={"#004E98"}/>
    </>
  );
};

export default SleepHoursChart;
