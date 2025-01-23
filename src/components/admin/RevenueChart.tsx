import React from 'react';
import { Card } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const RevenueChart: React.FC = () => {
    const data = [
        { month: 'T1', revenue: 1200000 },
        { month: 'T2', revenue: 1900000 },
        { month: 'T3', revenue: 2800000 },
        { month: 'T4', revenue: 2400000 },
        { month: 'T5', revenue: 2700000 },
        { month: 'T6', revenue: 3500000 },
    ];

    const formatVND = (value: number) => {
        return `${value.toLocaleString('vi-VN')}đ`;
    };

    return (
        <Card
            title="Thống kê doanh thu"
            bordered={false}
            bodyStyle={{ padding: '0 24px 24px' }}
        >
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: '#d9d9d9' }}
                            tickLine={{ stroke: '#d9d9d9' }}
                        />
                        <YAxis
                            tickFormatter={formatVND}
                            axisLine={{ stroke: '#d9d9d9' }}
                            tickLine={{ stroke: '#d9d9d9' }}
                        />
                        <Tooltip
                            formatter={(value) => formatVND(value as number)}
                            contentStyle={{
                                border: '1px solid #f0f0f0',
                                borderRadius: '4px',
                                padding: '8px'
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="revenue"
                            name="Doanh thu"
                            fill="#1890ff"
                            radius={[4, 4, 0, 0]} // Bo góc phía trên của cột
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RevenueChart;