import React, { useEffect, useState } from 'react';
import { Card, Skeleton } from 'antd';
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
import { motion } from 'framer-motion';

const RevenueChart: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; revenue: number; }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await callGetPaymentSuccess();
                if (res?.data?.data) {
                    const allMonths = Array.from({ length: 12 }, (_, i) => ({
                        month: `T${i + 1}`,
                        revenue: 0
                    }));

                    const revenueByMonth = res.data.data.reduce((acc: Record<string, number>, payment: IPayment) => {
                        const date = new Date(payment.createdAt);
                        const monthKey = `T${date.getMonth() + 1}`;
                        acc[monthKey] = (acc[monthKey] || 0) + payment.totalPrice;
                        return acc;
                    }, {});

                    const chartData = allMonths.map(monthData => ({
                        ...monthData,
                        revenue: revenueByMonth[monthData.month] || 0
                    }));

                    setMonthlyRevenue(chartData);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '8px',
                    border: '1px solid rgba(153, 27, 27, 0.2)',
                    borderRadius: '4px',
                }}>
                    <p style={{ margin: 0, color: '#4B5563' }}><strong>Tháng:</strong> {label}</p>
                    <p style={{ margin: '4px 0 0', color: '#991B1B' }}>
                        <strong>Doanh thu:</strong> {formatVND(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card
            title={
                <div style={{ 
                    textAlign: 'center', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: '#991B1B'
                }}>
                    Thống kê doanh thu
                </div>
            }
            bordered={false}
            bodyStyle={{ 
                padding: '0 24px 24px',
                backgroundColor: 'rgba(153, 27, 27, 0.02)'
            }}
            headStyle={{
                borderBottom: '2px solid rgba(153, 27, 27, 0.1)',
                padding: '16px 24px',
                backgroundColor: 'rgba(153, 27, 27, 0.02)'
            }}
        >
            {loading ? (
                <div style={{ padding: '20px' }}>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            ) : (
                <motion.div 
                    style={{ width: '100%', height: 350 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <ResponsiveContainer>
                        <BarChart
                            data={monthlyRevenue}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(153, 27, 27, 0.1)"
                            />
                            <XAxis 
                                dataKey="month"
                                tick={{ fill: '#4B5563' }}
                            />
                            <YAxis 
                                tickFormatter={formatVND}
                                tick={{ fill: '#4B5563' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    color: '#4B5563'
                                }}
                            />
                            <Bar
                                dataKey="revenue"
                                name="Doanh thu"
                                fill="#991B1B"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                                animationDuration={1000}
                                animationBegin={0}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </Card>
    );
};

export default RevenueChart;