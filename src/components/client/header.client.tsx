import { callCheckHrStatus, callFetchAllSkill, callGetCurrentUser, callLogout } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import styles from '@/styles/client.module.scss';
import { IBackendRes, IModelPaginate, ISkill, IUser } from "@/types/backend";
import {
    CodeOutlined,
    ContactsOutlined,
    CrownOutlined,
    FireOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    RiseOutlined,
    TwitterOutlined,
} from '@ant-design/icons';
import { Avatar, ConfigProvider, Drawer, Dropdown, Menu, MenuProps, Space } from 'antd';
import SearchClient from "components/client/search.client";
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logoImage from '../../assets/Logooo.png';
import HrActivationPopup from './HrActivationPopup';
import ManageAccount from './modal/manage.account';


interface HeaderProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ searchTerm, setSearchTerm }: HeaderProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const [current, setCurrent] = useState('home');
    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [showHrActivationPopup, setShowHrActivationPopup] = useState<boolean>(false);
    const [hrStatus, setHrStatus] = useState<{ isHrRole: boolean, isHrActivated: boolean } | null>(null);

    const handleManageAccount = () => {
        setOpenManageAccount(false); // Đóng modal nếu đang mở
        navigate('/profile');
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await callGetCurrentUser();
                if (res.data) {
                    setCurrentUser(res.data);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const checkHrStatus = async () => {
            if (isAuthenticated && user?.role?.name === 'HR') {
                try {
                    const res = await callCheckHrStatus();
                    if (res.data) {
                        setHrStatus({
                            isHrRole: Boolean(res.data.isHrRole),
                            isHrActivated: Boolean(res.data.isHrActivated)
                        });

                        // Hiển thị popup nếu là HR chưa kích hoạt
                        if (res.data.isHrRole && !res.data.isHrActivated) {
                            setShowHrActivationPopup(true);
                        }
                    }
                } catch (error) {
                    console.error("Error checking HR status:", error);
                }
            }
        };

        checkHrStatus();
    }, [isAuthenticated, user?.role?.name]);

    // Xử lý kích hoạt thành công
    const handleActivationSuccess = () => {
        setShowHrActivationPopup(false);
        // Cập nhật trạng thái HR đã kích hoạt
        setHrStatus(prev => prev ? { ...prev, isHrActivated: true } : null);

    };

    useEffect(() => {
        // Chỉ lấy path gốc, không bao gồm các path con
        const mainPath = '/' + location.pathname.split('/')[1];
        setCurrent(mainPath);
    }, [location.pathname]);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res: IBackendRes<IModelPaginate<ISkill>> = await callFetchAllSkill(''); // Thêm query nếu cần
                if (res && res.data) {
                    setSkills(res.data.result); // Gán dữ liệu kỹ năng vào state
                }
            } catch (error) {
                console.error("Lỗi khi gọi API kỹ năng:", error);
            }
        };
        fetchSkills();
    }, []);
    const skillItems = skills.map(skill => ({
        label: (
            <Link
                to={`/job?skills=${skill.id}`}
                style={{ textDecoration: 'none', color: 'white' }}
            >
                {skill.name}
            </Link>
        ),
        key: `skill-${skill.id}`,
        className: 'ant-menu-skill-item'  // Thêm class này
    }));


    const cities = [
        {
            label: "Hà Nội",
            key: "hanoi",
            value: "HANOI"
        },
        {
            label: "Thành Phố Hồ Chí Minh",
            key: "hcm",
            value: "HOCHIMINH"
        },
        {
            label: "Đà Nẵng",
            key: "danang",
            value: "DANANG"
        },
        {
            label: "Khác",
            key: "other",
            value: "OTHER"
        }
    ];

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: 'Việc Làm IT',
            key: 'job',
            icon: <CodeOutlined />,
            children: [
                {
                    label: <Link to={'/job'} style={{ textDecoration: 'none', color: 'white' }}>
                        Tất cả việc làm IT
                    </Link>,
                    key: '/job',
                },
                {
                    label: 'Việc IT theo kỹ năng',
                    key: 'job-skills',
                    children: skillItems
                },
                {
                    label: <Link to={'/job/cities'} style={{ textDecoration: 'none', color: 'white' }}>
                        Việc IT theo thành phố
                    </Link>,
                    key: '/job/cities',
                    children: cities.map(city => ({
                        label: (
                            <div
                                onClick={() => {
                                    navigate(`/job?location=${city.value}`);
                                }}
                                style={{ textDecoration: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                {city.label}
                            </div>
                        ),
                        key: `/job/cities/${city.key}`,
                    }))
                }
            ]
        },
        {
            label: <Link to={'/company'} style={{ textDecoration: 'none', color: 'white' }}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            toast.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={handleManageAccount}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user.role?.permissions?.length ? [{
            label: <Link to={"/admin"}>Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        }] : []),
        ...(user?.role?.name === 'HR' || user?.role?.name === 'SUPER_ADMIN' ? [{
            label: <Link to="/donate">Mua VIP</Link>,
            key: 'donate',
            icon: <CrownOutlined />
        }] : []),
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-container"]}>
                <div className={styles["header-section"]}>
                    <div className={styles["container"]}>
                        {!isMobile ? (
                            <div style={{ display: "flex", gap: 30 }}>
                                <div className={styles['brand']}>
                                    <img
                                        src={logoImage}
                                        alt="Jobhunter Logo"
                                        onClick={() => navigate('/')}
                                        title='Jobhunter'
                                    />
                                </div>
                                <div className={styles['top-menu']}>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: '#1677ff',
                                                colorBgContainer: 'transparent',
                                                colorText: '#fff',
                                                colorTextBase: '#fff',
                                                colorBgElevated: '#222831',
                                                controlItemBgHover: 'transparent',
                                                colorBgTextHover: 'transparent',
                                            },
                                            components: {
                                                Menu: {
                                                    horizontalItemSelectedColor: '#fff',
                                                    horizontalItemHoverColor: '#1677ff',
                                                    itemHoverColor: 'white',
                                                    itemSelectedColor: 'white',
                                                    itemBg: 'transparent',
                                                    itemHoverBg: 'transparent',
                                                    subMenuItemBg: 'transparent',
                                                    darkItemSelectedBg: 'transparent',
                                                    darkItemHoverBg: '#1677ff',
                                                }
                                            }
                                        }}
                                    >
                                        <Menu
                                            selectedKeys={[current]}
                                            mode="horizontal"
                                            items={items}
                                            style={{ background: 'transparent' }}
                                            selectable={false}
                                        />
                                    </ConfigProvider>
                                    <div className={styles['extra']}>
                                        {isAuthenticated === false ? (
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <Link
                                                    to="employer"
                                                    style={{
                                                        fontWeight: 'bold',
                                                        color: '#fff',
                                                        marginRight: '15px',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    Nhà tuyển dụng
                                                </Link>
                                                <Link
                                                    to={'/login'}
                                                    style={{
                                                        color: '#fff',
                                                        fontSize: '16px'
                                                    }}
                                                >
                                                    Đăng Nhập
                                                </Link>
                                            </div>
                                        ) : (
                                            <Space size="large">
                                                {/* Hiển thị "Nhà tuyển dụng" cho người đăng nhập NGOẠI TRỪ người dùng có role là HR */}
                                                {user?.role?.name !== 'HR' && (
                                                    <Link
                                                        to="employer"
                                                        style={{
                                                            fontWeight: 'bold',
                                                            color: '#fff',
                                                            marginRight: '15px',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        Nhà tuyển dụng
                                                    </Link>
                                                )}
                                                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                                    <Space style={{ cursor: "pointer" }}>
                                                        <span>Xin chào {currentUser?.name || user?.name}</span>
                                                        {currentUser?.urlAvatar ? (
                                                            <Avatar src={currentUser.urlAvatar} />
                                                        ) : (
                                                            <Avatar>{(currentUser?.name || user?.name)?.substring(0, 2)?.toUpperCase()}</Avatar>
                                                        )}
                                                    </Space>
                                                </Dropdown>
                                            </Space>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles['header-mobile']}>
                                <img
                                    src={logoImage}
                                    alt="Jobhunter Logo"
                                    style={{ width: '100px', height: 'auto' }}
                                />
                                <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles["search-section"]}>
                    <div className={styles["container"]}>
                        <SearchClient />
                    </div>
                </div>
            </div>

            <Drawer
                title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>

            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />

            <HrActivationPopup
                isVisible={showHrActivationPopup}
                onClose={() => setShowHrActivationPopup(false)}
                onSuccess={handleActivationSuccess}
                userName={currentUser?.name || user?.name}
                userEmail={currentUser?.email || user?.email || ''}
            />
        </>
    );
};

export default Header;