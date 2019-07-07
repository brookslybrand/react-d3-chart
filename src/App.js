import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import data from './data'
import Chart from './Chart'

const WIDTH = 975
const HEIGHT = 500
const MARGIN = { top: 20, right: 30, bottom: 30, left: 40 }
const DURATION = 500
const DELAY = 2

const App = () => {
  const [newData, setNewData] = useState(() => {
    // yes, I'm repeating these here...
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([MARGIN.left, WIDTH - MARGIN.right])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([HEIGHT - MARGIN.bottom, MARGIN.top])

    return data.map((d, i) => {
      const xvalue = x(d.date)
      const yvalue = y(d.value)
      const sy = HEIGHT - MARGIN.bottom
      const sx = xvalue
      return {
        x: xvalue,
        y: yvalue,
        sx: sx,
        sy: sy,
        cx: sx,
        cy: sy
      }
    })
  })

  useEffect(() => {
    const timer = d3.timer(absT => {
      setNewData(prevNewData => {
        const newData = [...prevNewData]
        if (absT > DURATION + DELAY * newData.length) {
          timer.stop()
        }
        newData.forEach((d, i, a) => {
          const elapsed = Math.min(DURATION, absT - DELAY * i)
          if (elapsed < 0) return
          const t = d3.easeBackOut(elapsed / DURATION)
          a[i].cx = d.sx + (d.x - d.sx) * t
          a[i].cy = d.sy + (d.y - d.sy) * t
        })
        return newData
      })
    })

    return () => timer.stop()
  }, [])

  return (
    <>
      <header>
        <h2 style={{ margin: '1rem' }}>
          Example taken from:
          https://observablehq.com/@tezzutezzu/d3-line-chart-animated
        </h2>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <Chart
          dimensions={{ width: WIDTH, height: HEIGHT, margin: MARGIN }}
          data={data}
          newData={newData}
          yLable={'$ Close'}
        />
      </main>
    </>
  )
}

export default App
