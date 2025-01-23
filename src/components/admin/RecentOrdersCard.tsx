import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { callGetPaymentSuccess } from '@/config/api';
import type { IPayment } from '@/types/backend';
import styles from '@/styles/dashboard.module.scss';

const RecentOrdersCard: React.FC = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await callGetPaymentSuccess();
                if (res?.data?.data) {
                    // Only keep the most recent 50 orders
                    const recentPayments = res.data.data.slice(0, 50);
                    setPayments(recentPayments);
                }
            } catch (error) {
                console.error('Error:', error);
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
                <span style={{ fontWeight: 500, color: '#262626' }}>{text}</span>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (amount) => (
                <span style={{ color: '#52c41a', fontWeight: 600 }}>
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
                <span style={{ color: '#8c8c8c' }}>
                    {new Date(text).toLocaleString('vi-VN')}
                </span>
            )
        }
    ];

    return (
        <Card
            title={<div style={{ textAlign: 'center', fontSize: '16px', fontWeight: 500 }}>Đơn hàng mới</div>}
            bordered={false}
            className={styles['orders-card']}
            bodyStyle={{
                padding: '0 24px',
                height: 'calc(100% - 58px)',
                overflow: 'auto'
            }}
            headStyle={{
                borderBottom: '1px solid #f0f0f0',
                padding: '16px 24px'
            }}
        >
            <Table
                columns={columns}
                dataSource={payments}
                pagination={{
                    pageSize: 5,
                    position: ['bottomCenter'],
                    size: 'small',
                    showSizeChanger: false
                }}
                size="middle"
                rowKey="id"
                scroll={{ y: 'calc(100vh - 450px)' }}
            />
        </Card>
    );
};

export default RecentOrdersCard;