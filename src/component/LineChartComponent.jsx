import { React, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label
} from 'recharts';

const lightTheme = {
    axis: '#333',
    grid: '#e0e0e0',
    label: '#1976d2',
    tooltipBg: '#fff',
    tooltipText: '#1976d2',
    line: '#1976d2',
    legend: '#1976d2',
};
const darkTheme = {
    axis: '#f1f1f1',
    grid: '#444',
    label: '#90caf9',
    tooltipBg: '#23272f',
    tooltipText: '#90caf9',
    line: '#90caf9',
    legend: '#90caf9',
};

function LineChartComponent({ stockUnits, theme = 'light' }) {
    const [timeFrame, setTimeFrame] = useState('1week');
    const currentDate = new Date();
    const themeObj = theme === 'dark' ? darkTheme : lightTheme;

    const timeFrames = {
        '1week': 7,
        '1month': 30,
        '3months': 90,
        '6months': 180,
        '1year': 365,
        '5years': 1825,
        'all': stockUnits.length,
    };

    const filteredData = stockUnits.filter((data) => {
        const dataDate = new Date(data.dateTime);
        const timeFrameDays = timeFrames[timeFrame];
        return (currentDate - dataDate) / (1000 * 3600 * 24) <= timeFrameDays;
    });

    return (
        <div style={{ width: '100%', minHeight: 550, background: 'none', borderRadius: '12px', padding: '24px', boxSizing: 'border-box', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 16, color: themeObj.label, letterSpacing: 1 }}>Stock Price Over Time</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        borderRadius: '6px',
                        border: `1px solid ${themeObj.axis}`,
                        maxWidth: '200px',
                        textAlign: 'center',
                        height: '40px',
                        background: theme === 'dark' ? '#23272f' : '#fff',
                        color: themeObj.axis,
                        boxShadow: '0 1px 4px rgba(25, 118, 210, 0.07)'
                    }}
                >
                    <option value="1week">1 Week</option>
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="5years">5 Years</option>
                    <option value="all">All</option>
                </select>
            </div>
            {filteredData.length === 0 ? (
                <div style={{ color: themeObj.axis, textAlign: 'center', marginTop: '120px', fontSize: 20 }}>
                    No data available for the selected timeframe.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={420}>
                    <LineChart
                        data={filteredData}
                        margin={{
                            top: 20,
                            right: 40,
                            left: 10,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={themeObj.grid} />
                        <XAxis dataKey="dateTime" minTickGap={20} tick={{ fontSize: 13, fill: themeObj.axis }}>
                            <Label value="Date" offset={-10} position="insideBottom" style={{ fill: themeObj.label }} />
                        </XAxis>
                        <YAxis tick={{ fontSize: 13, fill: themeObj.axis }}>
                            <Label value="Close Price" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: themeObj.label }} />
                        </YAxis>
                        <Tooltip
                            contentStyle={{ background: themeObj.tooltipBg, borderRadius: 8, border: `1px solid ${themeObj.label}` }}
                            labelStyle={{ color: themeObj.tooltipText, fontWeight: 600 }}
                            itemStyle={{ color: themeObj.tooltipText }}
                            formatter={(value, name) => [`$${value.toFixed(2)}`, 'Close']}
                            labelFormatter={label => `Date: ${label}`}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: themeObj.legend }} />
                        <Line type="monotone" dataKey="close" stroke={themeObj.line} strokeWidth={3} dot={{ r: 3, stroke: themeObj.line, fill: themeObj.line }} activeDot={{ r: 7, stroke: themeObj.line, fill: themeObj.line }} name="Close Price" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default LineChartComponent