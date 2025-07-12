import { useState } from 'react'
import axios from 'axios'
import './App.css'
import LineChartComponent from './component/LineChartComponent';
import BookmarkStock from './component/BookmarkStock';

// Theme objects
const lightTheme = {
  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  card: '#fff',
  cardAlt: '#f7f9fc',
  text: '#222',
  textSecondary: '#888',
  accent: '#1976d2',
  inputBg: '#f7f9fc',
  inputText: '#222',
  border: '#b0b0b0',
  error: '#d32f2f',
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
};
const darkTheme = {
  background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  card: '#23272f',
  cardAlt: '#2c313a',
  text: '#f1f1f1',
  textSecondary: '#b0b0b0',
  accent: '#90caf9',
  inputBg: '#23272f',
  inputText: '#f1f1f1',
  border: '#444',
  error: '#ef5350',
  shadow: '0 4px 24px rgba(0,0,0,0.32)',
};

function App() {
  const [theme, setTheme] = useState('light');
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const themeObj = theme === 'dark' ? darkTheme : lightTheme;

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const fetchStockData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8090/api/v1/stock/daily/${symbol}`);
      setStockData(response.data);
    } catch (error) {
      setError('Failed to fetch stock data. Please check the symbol and try again.');
      setStockData(undefined);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      background: themeObj.background,
      fontFamily: 'Inter, Arial, sans-serif',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      color: themeObj.text,
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Header */}
      <header
        style={{
          width: '100%',
          background: themeObj.accent,
          color: '#fff',
          padding: '24px 0 16px 0',
          letterSpacing: 2,
          fontWeight: 700,
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
          boxShadow: themeObj.shadow,
          marginBottom: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Left: Logo */}
        <span role="img" aria-label="stock" style={{ marginLeft: 32, fontSize: 32 }}>📈</span>
        {/* Center: Title */}
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 'inherit', letterSpacing: 2 }}>
          Stock Data Analytics
        </span>
        {/* Right: Theme Toggle */}
        <button
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            marginRight: 32,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: 28,
            padding: 0,
            outline: 'none',
            transition: 'color 0.2s',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </header>
      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100vw',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}>
        {/* Input Card */}
        <div style={{
          background: themeObj.card,
          padding: '28px 32px',
          borderRadius: '16px',
          boxShadow: themeObj.shadow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
          minWidth: 260,
          width: '100%',
          maxWidth: 420,
          transition: 'background 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
            <input
              type="text"
              style={{
                flex: 1,
                height: '38px',
                padding: '8px 12px',
                fontSize: '18px',
                borderRadius: '8px',
                border: `1px solid ${themeObj.border}`,
                marginRight: 8,
                background: themeObj.inputBg,
                color: themeObj.inputText,
                transition: 'border 0.2s, background 0.3s, color 0.3s',
              }}
              value={symbol}
              onChange={handleSymbolChange}
              placeholder="Enter Stock symbol"
              onKeyDown={e => { if (e.key === 'Enter') fetchStockData(); }}
              disabled={loading}
            />
            <button
              onClick={fetchStockData}
              style={{
                padding: '10px 24px',
                fontSize: '18px',
                borderRadius: '8px',
                backgroundColor: loading ? themeObj.border : themeObj.accent,
                color: '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: themeObj.shadow,
                minWidth: 120,
                transition: 'background 0.2s',
              }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
          </div>
          {error && <div style={{ color: themeObj.error, marginTop: 14, fontWeight: 500 }}>{error}</div>}
        </div>
        {/* Chart & Bookmark Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '32px',
            width: '100%',
            maxWidth: '1600px',
            justifyContent: 'center',
            alignItems: 'stretch',
            flexWrap: 'nowrap',
            margin: '0 auto',
            boxSizing: 'border-box',
            paddingBottom: 32,
          }}
        >
          <div
            style={{
              flex: 2,
              minWidth: 0,
              background: 'none',
              borderRadius: '12px',
              padding: 0,
              minHeight: '350px',
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              overflow: 'auto',
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 420 }}>
                <div className="spinner" style={{ width: 48, height: 48, border: `6px solid ${themeObj.cardAlt}`, borderTop: `6px solid ${themeObj.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              </div>
            ) : stockData ? (
              <LineChartComponent stockUnits={stockData.stockUnits} theme={theme} />
            ) : (
              <div style={{ color: themeObj.textSecondary, textAlign: 'center', marginTop: '120px', fontSize: 20 }}>
                No data to display
              </div>
            )}
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: themeObj.cardAlt,
              borderRadius: '12px',
              boxShadow: themeObj.shadow,
              padding: '24px',
              minHeight: '350px',
              width: '100%',
              maxWidth: 420,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
              overflow: 'auto',
              transition: 'background 0.3s',
            }}
          >
            <h4 style={{ color: themeObj.accent, marginBottom: 18, letterSpacing: 1 }}>Bookmarked Stocks</h4>
            <BookmarkStock theme={theme} />
          </div>
        </div>
      </div>
      {/* Spinner Keyframes and Global Styles */}
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        *, *:before, *:after {
          box-sizing: inherit;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .chart-bookmark-row {
            flex-direction: column !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default App