import React, { useEffect, useState } from 'react';
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
import { callGetPaymentSuccess } from '@/config/api';
import { IPayment } from '@/types/backend';

const RevenueChart: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number; }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await callGetPaymentSuccess();
                if (res?.data?.data) {
                    // Initialize all months with zero revenue
                    const allMonths = Array.from({ length: 12 }, (_, i) => ({
                        month: `T${i + 1}`,
                        revenue: 0
                    }));

                    // Group data by month and calculate total revenue
                    const revenueByMonth = res.data.data.reduce((acc: Record<string, number>, payment: IPayment) => {
                        const date = new Date(payment.createdAt);
                        const monthKey = `T${date.getMonth() + 1}`;

                        acc[monthKey] = (acc[monthKey] || 0) + payment.totalPrice;
                        return acc;
                    }, {});

                    // Merge the revenue data with all months
                    const chartData = allMonths.map(monthData => ({
                        ...monthData,
                        revenue: revenueByMonth[monthData.month] || 0
                    }));

                    setMonthlyRevenue(chartData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

    return (
        <Card
            title="Thống kê doanh thu theo tháng"
            bordered={false}
            bodyStyle={{ padding: '0 24px 24px' }}
        >
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={monthlyRevenue}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatVND} />
                        <Tooltip formatter={(value) => formatVND(value as number)} />
                        <Legend />
                        <Bar
                            dataKey="revenue"
                            name="Doanh thu"
                            fill="#1890ff"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default RevenueChart;