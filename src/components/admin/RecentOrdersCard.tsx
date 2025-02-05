import React, { useEffect, useState } from 'react';
import { Card, Table, Skeleton } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { callGetPaymentSuccess } from '@/config/api';
import type { IPayment } from '@/types/backend';
import styles from '@/styles/dashboard.module.scss';
import { motion } from 'framer-motion';

const RecentOrdersCard: React.FC = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await callGetPaymentSuccess();
                if (res?.data?.data) {
                    const recentPayments = res.data.data.slice(0, 50);
                    setPayments(recentPayments);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const columns: ColumnsType<IPayment> = [
        {
            title: 'ID Thanh Toán',
            dataIndex: 'paymentRef',
            key: 'paymentRef',
            render: (text) => (
                <span style={{ fontWeight: 500, color: '#1F2937' }}>
                    {text}
                </span>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (amount) => (
                <span style={{ color: '#991B1B', fontWeight: 600 }}>
                    {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(amount)}
                </span>
            )
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => (
                <span style={{ color: '#4B5563' }}>
                    {new Date(text).toLocaleString('vi-VN')}
                </span>
            )
        }
    ];

    return (
        <Card
            title={
                <div style={{ 
                    textAlign: 'center', 
                    fontSize: '18px', 
                    fontWeight: 600,
                    color: '#991B1B'
                }}>
                    Đơn hàng mới
                </div>
            }
            bordered={false}
            className={styles['orders-card']}
            bodyStyle={{
                padding: '0 24px',
                height: 'calc(100% - 58px)',
                overflow: 'auto'
            }}
            headStyle={{
                borderBottom: '2px solid rgba(153, 27, 27, 0.1)',
                padding: '16px 24px',
                backgroundColor: 'rgba(153, 27, 27, 0.02)'
            }}
        >
            {loading ? (
                <div style={{ padding: '20px' }}>
                    <Skeleton active paragraph={{ rows: 5 }} />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <Table
                        columns={columns}
                        dataSource={payments}
                        pagination={{
                            pageSize: 5,
                            position: ['bottomCenter'],
                            size: 'small',
                            showSizeChanger: false,
                        }}
                        size="middle"
                        rowKey="id"
                        scroll={{ y: 'calc(100vh - 450px)' }}
                        className={styles['recent-orders-table']}
                        onRow={() => ({
                            style: {
                                transition: 'all 0.1s ease'
                            }
                        })}
                    />
                </motion.div>
            )}
        </Card>
    );
};

export default RecentOrdersCard;