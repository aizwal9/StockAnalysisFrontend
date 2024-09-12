import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function StockChart({data}) {

    // Data preparation for charts
  // Data preparation for charts
  const closeData = data ? data.map((dataPoint) => ({
    date: dataPoint.date,
    close: dataPoint.close,
  })) : [];

  const volumeData = data ? data.map((dataPoint) => ({
    date: dataPoint.date,
    volume: dataPoint.volume,
  })) : [];

  return (
    <div>
      <h2>Stock Charts</h2>
      {/* <h3>{metaData.symbol}</h3>
      <p>Last Refreshed : {metaData.lastRefreshed}</p> */}
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* Closing Price Chart */}
        <ResponsiveContainer width="45%" height={300}>
          <LineChart data={closeData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${value}`} /> {/* Default tickFormatter */}
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>

        {/* Volume Chart */}
        <ResponsiveContainer width="45%" height={300}>
          <LineChart data={volumeData}>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${value}`} /> {/* Default tickFormatter */}
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="volume" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StockChart