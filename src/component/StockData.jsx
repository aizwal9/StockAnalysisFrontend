import React from 'react';

const StockData = ({ stockData }) => {
  return (
    <div>
      <h2>Stock Data for {stockData.symbol}</h2>
      {stockData && stockData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.open}</td>
                <td>{row.high}</td>
                <td>{row.low}</td>
                <td>{row.close}</td>
                <td>{row.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ):(<p> No data available for symbol</p>)}
    </div>
  );
};

export default StockData;