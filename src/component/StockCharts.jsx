import { React, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const StockChart = ({ data, type, filter }) => {
  const filteredData = data.filter((unit) => {
    const date = new Date(unit.date);
    const now = new Date();
    switch (filter) {
      case 'hour':
        return date >= new Date(now - 3600000);
      case 'day':
        return date >= new Date(now - 86400000);
      case 'week':
        return date >= new Date(now - 604800000);
      case 'month':
        return date >= new Date(now - 2592000000);
      case 'year':
        return date >= new Date(now - 31536000000);
      case '5year':
        return date >= new Date(now - 157680000000);
      default:
        return true;

    }
  });

  return (
    <LineChart width={1200} height={200} data={filteredData}>
      <Line type="monotone" dataKey={type} stroke="#8884d8" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div>
        <p>${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const StockCharts = ({ stockUnits }) => {
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const openData = stockUnits.map((unit) => ({ date: unit.date, value: unit.open }));
  const highData = stockUnits.map((unit) => ({ date: unit.date, value: unit.high }));
  const lowData = stockUnits.map((unit) => ({ date: unit.date, value: unit.low }));

  return (
    <div>
      <StockChart data={openData} type="value" title="Open Price" filter={filter} />
      <StockChart data={highData} type="value" title="High Price" filter={filter} />
      <StockChart data={lowData} type="value" title="Low Price" filter={filter} />
      <div>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="5year">5 Years</option>
        </select>
      </div>
    </div>
  );
};

export default StockCharts;