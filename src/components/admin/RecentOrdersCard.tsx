import React from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OrderData {
    id_payment: string;
    total: number;
    created_at: string;
}

const RecentOrdersCard: React.FC = () => {
    const data: OrderData[] = [
        {
            id_payment: 'PAY001',
            total: 1500000,
            created_at: '2024-01-23 10:30:00'
        },
        {
            id_payment: 'PAY002',
            total: 2300000,
            created_at: '2024-01-23 11:45:00'
        },
        {
            id_payment: 'PAY003',
            total: 3450000,
            created_at: '2024-01-23 13:15:00'
        },
    ];

    const columns: ColumnsType<OrderData> = [
        {
            title: 'ID Thanh Toán',
            dataIndex: 'id_payment',
            key: 'id_payment',
            render: (text) => (
                <span style={{ fontWeight: 500, color: '#262626' }}>{text}</span>
            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
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
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => (
                <span style={{ color: '#8c8c8c' }}>
                    {new Date(text).toLocaleString('vi-VN')}
                </span>
            )
        }
    ];

    return (
        <Card
            title="Đơn hàng mới"
            bordered={false}
            style={{ height: '100%' }}
            bodyStyle={{ padding: '0 24px' }}
        >
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                size="middle"
            />
        </Card>
    );
};

export default RecentOrdersCard;