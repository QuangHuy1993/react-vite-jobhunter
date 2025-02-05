import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Table, Dropdown, Menu, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined, DownOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchRevenueStatistics } from '@/redux/slice/revenueStatisticsSlide';
import { fetchPostLimits } from '@/redux/slice/postlimitReducer';
import { AppDispatch, RootState } from '@/redux/store';
import styles from '@/styles/revenueStatistics.module.scss';
import { IPostLimit } from '@/types/backend';
import RecentOrdersCard from "components/admin/RecentOrdersCard";
import RevenueChart from "components/admin/RevenueChart";

const RevenueStatistics: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const { result: revenueData, isFetching, error } = useSelector((state: RootState) => state.revenueStatistics);
    const { result: postLimits } = useSelector((state: RootState) => state.postLimit);

    useEffect(() => {
        dispatch(fetchRevenueStatistics(selectedYear));
        dispatch(fetchPostLimits({ query: '' }));
    }, [dispatch, selectedYear]);

    const filteredData = revenueData.filter(item => item.month === selectedMonth);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setSelectedMonth(prevMonth => {
            if (direction === 'prev') {
                return prevMonth > 1 ? prevMonth - 1 : 12;
            } else {
                return prevMonth < 12 ? prevMonth + 1 : 1;
            }
        });
    };

    const yearMenu = (
        <Menu>
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                <Menu.Item key={year} onClick={() => handleYearChange(year)}>
                    Năm {year}
                </Menu.Item>
            ))}
        </Menu>
    );

    if (isFetching) return <div className={styles.loading}>Đang tải...</div>;
    if (error) return <div className={styles.error}>Lỗi: {error.message}</div>;

    const dataWithRevenue = filteredData.map(item => {
        const postLimit = postLimits.find((limit: IPostLimit) => limit.planName === item.planName);
        const revenue = postLimit ? item.totalSales * postLimit.price : 0;
        return {
            ...item,
            revenue: revenue
        };
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const pieChartData = dataWithRevenue.map((item, index) => ({
        name: item.planName,
        value: item.totalSales,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <Row gutter={[16, 16]}>
            <Col span={12} className={styles.cardContainer}>
                <Card className={styles.revenueCard}>
                    <div className={styles.cardTitle}>
                        <Dropdown overlay={yearMenu} trigger={['click']}>
                            <div className={styles.yearSelector}>
                                Số lượng gói VIP bán ra - Năm {selectedYear}
                                <DownOutlined className={styles.yearSelectorIcon}/>
                            </div>
                        </Dropdown>
                    </div>
                    <div className={styles.monthSelector}>
                        <div className={styles.monthButton} onClick={() => handleMonthChange('prev')}>
                            <LeftOutlined/>
                        </div>
                        <span className={styles.monthText}>Tháng {selectedMonth}</span>
                        <div className={styles.monthButton} onClick={() => handleMonthChange('next')}>
                            <RightOutlined/>
                        </div>
                    </div>
                    <Table
                        columns={[
                            {
                                title: 'Gói',
                                dataIndex: 'planName',
                                key: 'planName',
                                className: styles.planNameColumn,
                            },
                            {
                                title: 'Số lượng',
                                dataIndex: 'totalSales',
                                key: 'totalSales',
                                render: (value: number) => value.toLocaleString(),
                            },

                        ]}
                        dataSource={dataWithRevenue}
                        rowKey={(record) => `${record.month}-${record.planName}`}
                        pagination={false}
                        size="middle"
                    />
                </Card>
            </Col>
            <Col span={12} className={styles.cardContainer}>
                <Card className={styles.revenueCard}>
                    <div className={styles.cardTitle}>
                        Tỷ lệ gói VIP bán ra - Tháng {selectedMonth}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({
                                            name,
                                            percent
                                        }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color}/>
                                ))}
                            </Pie>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
            <Col span={12} className={styles.cardContainer}>
                <RecentOrdersCard/>
            </Col>
            <Col span={12} className={styles.cardContainer}>
                <RevenueChart/>
            </Col>
        </Row>
    );
};

export default RevenueStatistics;