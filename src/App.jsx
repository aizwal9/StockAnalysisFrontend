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
    <>
      <input type="text" value={symbol} onChange={handleSymbolChange} placeholder="Enter Stock symbol" />
      <button onClick={fetchStockData}>Fetch Data</button>
      {/* <StockData stockData={stockData}></StockData> */}
     {/* {stockData  && (
      <StockChart data={stockData} />
     )} */}
      {/* {stockData && (
        <D3LineChart data={stockData} symbol={symbol} />
      )} */}
      {stockData && (
        // <StockCharts stockUnits={stockData.stockUnits}/>
        <LineChartComponent stockUnits={stockData.stockUnits} />
      )}
      <BookmarkStock />
      </>
  )
}

export default App
