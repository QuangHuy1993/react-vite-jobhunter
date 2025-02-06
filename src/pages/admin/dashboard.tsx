import { callCountCompanies, callCountJobs, callCountResumes, callCountUsers, callGetTotalPricePaymentSuccess } from '@/config/api';
import styles from '@/styles/dashboard.module.scss';
import {
    AliwangwangOutlined,
    BankOutlined,
    LineChartOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import RecentOrdersCard from '../../components/admin/RecentOrdersCard';
import RevenueChart from '../../components/admin/RevenueChart';



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
    const [userCount, setUserCount] = useState(0);
    const [companyCount, setCompanyCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [resumeCount, setResumeCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [users, companies, jobs, resumes, revenue] = await Promise.all([
                    callCountUsers(),
                    callCountCompanies(),
                    callCountJobs(),
                    callCountResumes(),
                    callGetTotalPricePaymentSuccess()
                ]);

                setUserCount(users.data ?? 0);
                setCompanyCount(companies.data ?? 0);
                setJobCount(jobs.data ?? 0);
                setResumeCount(resumes.data ?? 0);
                setTotalRevenue(revenue.data?.data ?? 0);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);


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
            <Row gutter={[16, 16]} className={styles['statistic-row']}>
                {[
                    { title: "Người dùng hoạt động", value: userCount, icon: <UserOutlined />, colorClass: "blue" },
                    { title: "Công ty", value: companyCount, icon: <BankOutlined />, colorClass: "green" },
                    { title: "Công việc", value: jobCount, icon: <ScheduleOutlined />, colorClass: "purple" },
                    { title: "Hồ sơ", value: resumeCount, icon: <AliwangwangOutlined />, colorClass: "orange" },
                    { title: "Doanh thu", value: `${totalRevenue.toLocaleString()}đ`, icon: <LineChartOutlined />, colorClass: "red" }

                ].map((item, index) => (
                    <Col xs={24} sm={12} md={12} lg={4} xl={4} key={index} className={styles['statistic-col']}>
                        <StatisticCard
                            title={item.title}
                            value={item.value}
                            icon={React.cloneElement(item.icon, { style: { fontSize: '24px' } })}
                            colorClass={item.colorClass}
                            index={index}
                        />
                    </Col>
                ))}
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