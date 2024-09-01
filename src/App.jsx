import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import StockData from './component/StockData';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState([]);

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/stock/${symbol}`);
      setStockData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <input type="text" value={symbol} onChange={handleSymbolChange} placeholder="Enter Stock symbol" />
      <button onClick={fetchStockData}>Fetch Data</button>
      <StockData stockData={stockData}></StockData>
    </>
  )
}

export default App
