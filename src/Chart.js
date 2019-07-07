import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

const line = d3
  .line()
  .x(d => d.cx)
  .y(d => d.cy)

const Chart = ({ dimensions, data, newData, yLable }) => {
  // destructure the dimensions
  const { width, height, margin } = dimensions
  const svgRef = useRef()
  const pathRef = useRef()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top])

    const xAxis = g =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      )

    const yAxis = g =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())
        .call(g =>
          g
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(yLable)
        )

    svg.append('g').call(xAxis)

    svg.append('g').call(yAxis)

    pathRef.current = svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
  }, [
    data,
    height,
    margin.bottom,
    margin.left,
    margin.right,
    margin.top,
    width,
    yLable
  ])

  useEffect(() => {
    pathRef.current.attr('d', line(newData))
  }, [newData])

  return (
    <svg
      ref={svgRef}
      viewBox={`0,0,${width},${height}`}
      width={width}
      height={height}
    />
  )
}

export default Chart
