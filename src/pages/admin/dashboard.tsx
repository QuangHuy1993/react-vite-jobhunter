import React from 'react';
import { Row, Col, Card } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ScheduleOutlined,
    AliwangwangOutlined,
} from '@ant-design/icons';
import RecentOrdersCard from '../../components/admin/RecentOrdersCard';
import RevenueChart from '../../components/admin/RevenueChart';
import styles from '@/styles/dashboard.module.scss';

const StatisticCard = ({ title, value, icon, colorClass }: any) => (
    <Card bordered={false} className={styles['statistic-card']}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`${styles['icon-wrapper']} ${styles[colorClass]}`}>
                {icon}
            </div>
            <div>
                <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '4px' }}>
                    {title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>
                    {value.toLocaleString()}
                </div>
            </div>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
    return (
        <div className={styles['dashboard-container']}>
            {/* Statistics Cards */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Người dùng hoạt động"
                        value={112893}
                        icon={<UserOutlined style={{ fontSize: '24px' }} />}
                        colorClass="blue"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Công ty"
                        value={2345}
                        icon={<BankOutlined style={{ fontSize: '24px' }} />}
                        colorClass="green"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Công việc"
                        value={3456}
                        icon={<ScheduleOutlined style={{ fontSize: '24px' }} />}
                        colorClass="purple"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Hồ sơ"
                        value={8434}
                        icon={<AliwangwangOutlined style={{ fontSize: '24px' }} />}
                        colorClass="orange"
                    />
                </Col>
            </Row>

            {/* Charts and Orders in equal columns */}
            <div className={styles['info-section']}>
                <div className={styles['orders-card']}>
                    <RecentOrdersCard />
                </div>
                <div className={styles['revenue-card']}>
                    <RevenueChart />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;