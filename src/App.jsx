import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import StockData from './component/StockData';
import StockChart from './component/StockChart';
import D3LineChart from './component/D3LineChart';
import LineCharts from './component/StockCharts';
import StockCharts from './component/StockCharts';
import LineChartComponent from './component/LineChartComponent';
import BookmarkStock from './component/BookmarkStock';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState();

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:8090/api/v1/stock/daily/${symbol}`);
      setStockData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          style={{
            width: '160px',
            height: '30px',
            marginBottom: '15px',
            padding: '5px',
            fontSize: '18px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
          value={symbol}
          onChange={handleSymbolChange}
          placeholder="Enter Stock symbol"
        />
        <button
          onClick={fetchStockData}
          style={{
            padding: '10px 20px',
            fontSize: '20px',
            borderRadius: '10px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Fetch Data
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {stockData && (
          <LineChartComponent stockUnits={stockData.stockUnits} />
        )}
        <BookmarkStock />
      </div>
    </div>
  )
}

export default App
