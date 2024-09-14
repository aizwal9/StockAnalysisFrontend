import { React, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

function LineChartComponent({ stockUnits }) {
    const [timeFrame, setTimeFrame] = useState('1week');
    const currentDate = new Date();

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
        <div>
            <LineChart
                width={1200}
                height={500}
                data={filteredData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip
                    content={(props) => {
                        const { payload } = props;
                        if (payload && payload.length > 0 && payload[0].value) {
                            return (
                                <div>
                                    <p>Price: {payload[0].value}</p>
                                    <p>Date: {payload[0].payload.dateTime}</p>
                                </div>
                            );
                        }
                    }}
                />
                <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
            <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                style={{
                    padding: '8px 16px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    maxWidth: '200px',
                    textAlign: 'center',
                    height:'40px'
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
    );
}

export default LineChartComponent