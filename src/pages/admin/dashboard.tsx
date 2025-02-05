import React from 'react';
import { Row, Col, Card } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ScheduleOutlined,
    AliwangwangOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import RecentOrdersCard from '../../components/admin/RecentOrdersCard';
import RevenueChart from '../../components/admin/RevenueChart';
import styles from '@/styles/dashboard.module.scss';

const StatisticCard = ({ title, value, icon, colorClass, index }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
    >
        <Card bordered={false} className={styles['statistic-card']}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`${styles['icon-wrapper']} ${styles[colorClass]}`}>
                    {icon}
                </div>
                <div>
                    <div style={{ color: '#4B5563', fontSize: '14px', marginBottom: '4px' }}>
                        {title}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#1F2937' }}>
                        {value.toLocaleString()}
                    </div>
                </div>
            </div>
        </Card>
    </motion.div>
);

const Dashboard: React.FC = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                duration: 0.2
            }
        }
    };

    return (
        <motion.div 
            className={styles['dashboard-container']}
            initial="hidden"
            animate="show"
            variants={container}
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Người dùng hoạt động"
                        value={112893}
                        icon={<UserOutlined style={{ fontSize: '24px' }} />}
                        colorClass="blue"
                        index={0}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Công ty"
                        value={2345}
                        icon={<BankOutlined style={{ fontSize: '24px' }} />}
                        colorClass="green"
                        index={1}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Công việc"
                        value={3456}
                        icon={<ScheduleOutlined style={{ fontSize: '24px' }} />}
                        colorClass="purple"
                        index={2}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        title="Hồ sơ"
                        value={8434}
                        icon={<AliwangwangOutlined style={{ fontSize: '24px' }} />}
                        colorClass="orange"
                        index={3}
                    />
                </Col>
            </Row>

            <motion.div 
                className={styles['info-section']}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
            >
                <motion.div 
                    className={styles['orders-card']}
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.1 }}
                >
                    <RecentOrdersCard />
                </motion.div>
                <motion.div 
                    className={styles['revenue-card']}
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.1 }}
                >
                    <RevenueChart />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;