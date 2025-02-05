import React, { useState, useEffect } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    ApiOutlined,
    UserOutlined,
    BankOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AliwangwangOutlined,
    BugOutlined,
    ScheduleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { callLogout } from 'config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { TableChartOutlined } from "@mui/icons-material";
import styles from '@/styles/admin.module.scss';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/share/LoadingSpinner';

const { Content, Sider } = Layout;

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const user = useAppSelector(state => state.account.user);
    const permissions = useAppSelector(state => state.account.user.role.permissions);
    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // ... permissions checking code remains the same ...
    useEffect(() => {
        const ACL_ENABLE = import.meta.env.VITE_ACL_ENABLE;
        if (location.pathname === '/admin' && user?.role?.name !== 'SUPER_ADMIN') {
            navigate('/admin/job', { replace: true });
        }
        if (permissions?.length || ACL_ENABLE === 'false') {
            // ... rest of the permission checks remain the same ...
            const viewCompany = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.COMPANIES.GET_PAGINATE.method
            )

            const viewUser = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.USERS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewJob = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.JOBS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.JOBS.GET_PAGINATE.method
            )

            const viewResume = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.RESUMES.GET_PAGINATE.method
            )

            const viewRole = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.ROLES.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.ROLES.GET_PAGINATE.method
            )

            const viewPermission = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PERMISSIONS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.USERS.GET_PAGINATE.method
            )

            const viewPostLimit = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.POST_LIMITS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.POST_LIMITS.GET_PAGINATE.method
            )

            const viewPayment = permissions?.find(item =>
                item.apiPath === ALL_PERMISSIONS.PAYMENTS.GET_PAGINATE.apiPath
                && item.method === ALL_PERMISSIONS.PAYMENTS.GET_PAGINATE.method
            )

            const full = [
                {
                    label: <Link to='/admin'>Dashboard</Link>,
                    key: '/admin',
                    icon: <AppstoreOutlined />,
                    visible: user.role.name === 'SUPER_ADMIN'
                },
                ...(viewCompany || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/company'>Công ty</Link>,
                    key: '/admin/company',
                    icon: <BankOutlined />,
                }] : []),
                ...(viewUser || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/user'>Người dùng</Link>,
                    key: '/admin/user',
                    icon: <UserOutlined />
                }] : []),
                ...(viewPostLimit || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/post-limit'>Giới hạn bài đăng</Link>,
                    key: '/admin/post-limit',
                    icon: <TableChartOutlined />
                }] : []),
                ...(viewPayment || ACL_ENABLE === 'false' ? [{
                    label: 'Quản lý doanh thu',
                    key: '/admin/payment',
                    icon: <TableChartOutlined />,
                    children: [
                        {
                            label: <Link to='/admin/payment/stats'>Thống kê doanh thu</Link>,
                            key: '/admin/payment/stats'
                        },
                        {
                            label: <Link to='/admin/payment/list'>Danh sách giao dịch</Link>,
                            key: '/admin/payment/list'
                        }
                    ]
                }] : []),
                ...(viewJob || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/job'>Công việc</Link>,
                    key: '/admin/job',
                    icon: <ScheduleOutlined />
                }] : []),
                ...(viewResume || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/resume'>Hồ sơ</Link>,
                    key: '/admin/resume',
                    icon: <AliwangwangOutlined />
                }] : []),
                ...(viewPermission || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/permission'>Quyền hạn</Link>,
                    key: '/admin/permission',
                    icon: <ApiOutlined />
                }] : []),
                ...(viewRole || ACL_ENABLE === 'false' ? [{
                    label: <Link to='/admin/role'>Vai trò</Link>,
                    key: '/admin/role',
                    icon: <ExceptionOutlined />
                }] : []),
            ];

            setMenuItems(full);
        }
    }, [permissions, location, user, navigate])

    useEffect(() => {
        setActiveMenu(location.pathname)
    }, [location])

    const handleLogout = async () => {
        setIsLoading(true);
        const res = await callLogout();
        setIsLoading(false);
        if (res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <Link to={'/'}>Trang chủ</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <Layout className={styles['admin-layout']} style={{ minHeight: '100vh' }}>
                {!isMobile ? (
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={setCollapsed}
                        className={styles['admin-sider']}
                    >
                        <motion.div
                            className={styles['admin-logo']}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <BugOutlined style={{ fontSize: '24px', color: '#991B1B' }} />
                            {!collapsed && <span style={{ marginLeft: '10px', color: '#991B1B', fontWeight: 600 }}>ADMIN</span>}
                        </motion.div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems?.filter((item: any) => item.visible !== false)}
                            onClick={(e) => {
                                setIsLoading(true);
                                setActiveMenu(e.key);
                                setTimeout(() => setIsLoading(false), 300);
                            }}
                            className={styles['menu-item']}
                        />
                    </Sider>
                ) : (
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                )}

                <Layout>
                    {!isMobile && (
                        <motion.div 
                            className={styles['admin-header']}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                className={styles['collapse-btn']}
                            />
                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                <Space className={styles['user-info']}>
                                    <span style={{ color: '#4B5563' }}>Welcome</span>
                                    <span style={{ color: '#991B1B', fontWeight: 500 }}>{user?.name}</span>
                                    <Avatar style={{ backgroundColor: '#991B1B' }}>{user?.name?.substring(0, 2)?.toUpperCase()}</Avatar>
                                </Space>
                            </Dropdown>
                        </motion.div>
                    )}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className={styles['content']}
                    >
                        <Outlet />
                    </motion.div>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutAdmin;