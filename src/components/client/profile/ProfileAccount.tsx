import { callGetCurrentUser } from '@/config/api';
import styles from '@/styles/profile.module.scss';
import { IUser } from '@/types/backend';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { CiLink, CiLocationOn } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import { PiGenderIntersexLight } from "react-icons/pi";
import HeaderWithoutSearch from './header.withprofile';
import ProfileEditModal from './ProfileEditModal';
import ProfileSidebar from './ProfileSidebar';

const translateGender = (gender: string | undefined): string => {
    switch (gender) {
        case 'FEMALE':
            return 'Nữ';
        case 'MALE':
            return 'Nam';
        case 'OTHER':
            return 'Khác';
        default:
            return 'Chưa cập nhật';
    }
};

const ProfileAccount: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                setLoading(true);
                const res = await callGetCurrentUser();
                if (res.data) {
                    // Thêm độ trễ 1.5 giây trước khi cập nhật state
                    setTimeout(() => {
                        if (res.data) {
                            setCurrentUser(res.data);
                        }
                        setLoading(false);
                    }, 300); 
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
                // Cũng thêm độ trễ khi xử lý lỗi
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            }
        };

        fetchCurrentUser();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = (values: any) => {
        console.log('Form values:', values);
        setIsModalVisible(false);
        setCurrentUser(prevUser => ({ ...prevUser, ...values }));
    };

    const onPasswordChange = (values: any) => {
        console.log('Password change values:', values);
        setIsModalVisible(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={styles['layout-container']}>
            <HeaderWithoutSearch
                className={styles['header-override']}
                searchTerm={''}
                setSearchTerm={() => { }}

            />
            <div className={styles['profile-container']}>
                <ProfileSidebar activePage='profile' />

                <div className={styles['profile-content']}>
                    <div className={styles['profile-header']}>
                        <div className={styles['profile-avatar']}>
                            {currentUser?.urlAvatar ? (
                                <Avatar size={100} src={currentUser.urlAvatar} />
                            ) : (
                                <Avatar size={100} className={styles.avatar}>
                                    {currentUser?.name?.substring(0, 2)?.toUpperCase() || 'U'}
                                </Avatar>
                            )}
                        </div>
                        <div className={styles['profile-info']}>
                            <h1>{currentUser?.name}</h1>

                            <div className={styles['contact-info']}>
                                <div className={styles['info-item']}>
                                    <MdOutlineEmail className={styles['icon-email']} />
                                    <span>{currentUser?.email}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <MdLocalPhone className={styles['icon-phone']} />
                                    <span>{currentUser?.phoneNumber || 'Chưa cập nhật'}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <LiaBirthdayCakeSolid className={styles['icon-calendar']} />
                                    <span>{currentUser?.age || 'Chưa cập nhật'} tuổi</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <PiGenderIntersexLight className={styles['icon-gender']} />
                                    <span>{translateGender(currentUser?.gender)}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <CiLocationOn className={styles['icon-location']} />
                                    <span>{currentUser?.address || 'Chưa cập nhật'}</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <CiLink className={styles['icon-link']} />
                                    {currentUser?.urlProfile ? (
                                        <a
                                            href={currentUser.urlProfile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles['profile-link']}
                                        >
                                            {currentUser.urlProfile}
                                        </a>
                                    ) : (
                                        <span>Chưa cập nhật</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <FaRegEdit className={styles['edit-button']} onClick={showModal} />
                    </div>

                    <div className={styles['profile-sections']}>
                        <section className={styles['profile-section']}>
                            <div className={styles['section-header']}>
                                <h2>Giới thiệu bản thân</h2>
                                <button className={styles['add-button']}>
                                    <PlusOutlined />
                                </button>
                            </div>
                            <p className={styles['section-description']}>Giới thiệu điểm mạnh và số năm kinh nghiệm của bạn</p>
                        </section>

                        <section className={styles['profile-section']}>
                            <div className={styles['section-header']}>
                                <h2>Học vấn</h2>
                                <button className={styles['add-button']}>
                                    <PlusOutlined />
                                </button>
                            </div>
                            <p className={styles['section-description']}>Chia sẻ trình độ học vấn của bạn</p>
                        </section>

                        <section className={styles['profile-section']}>
                            <div className={styles['section-header']}>
                                <h2>Kinh nghiệm làm việc</h2>
                                <button className={styles['add-button']}>
                                    <PlusOutlined />
                                </button>
                            </div>
                            <p className={styles['section-description']}>Thể hiện những thông tin chi tiết về quá trình làm việc</p>
                        </section>

                        <section className={styles['profile-section']}>
                            <div className={styles['section-header']}>
                                <h2>Kỹ năng</h2>
                                <button className={styles['add-button']}>
                                    <PlusOutlined />
                                </button>
                            </div>
                            <p className={styles['section-description']}>Liệt kê các kỹ năng chuyên môn của bạn</p>
                        </section>

                        <section className={styles['profile-section']}>
                            <div className={styles['section-header']}>
                                <h2>Dự án cá nhân</h2>
                                <button className={styles['add-button']}>
                                    <PlusOutlined />
                                </button>
                            </div>
                            <p className={styles['section-description']}>Giới thiệu dự án cá nhân của bạn</p>
                        </section>
                        <ProfileEditModal
                            isVisible={isModalVisible}
                            onCancel={handleCancel}
                            onFinish={onFinish}
                            onPasswordChange={onPasswordChange}
                            initialValues={currentUser || {}}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAccount;