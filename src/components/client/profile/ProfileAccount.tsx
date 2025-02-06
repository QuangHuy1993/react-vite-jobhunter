import styles from '@/styles/profile.module.scss';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import React from 'react';
import { CiLink, CiLocationOn } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import { PiGenderIntersexLight } from "react-icons/pi";
import HeaderWithoutSearch from './header.withprofile';
import ProfileSidebar from './ProfileSidebar';

const ProfileAccount: React.FC = () => {
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
                            <Avatar size={100} src="/placeholder-avatar.jpg" />
                        </div>
                        <div className={styles['profile-info']}>
                            <h1>Quang Huy</h1>
                            <div className={styles['subtitle']}>Cập nhật chức danh</div>

                            <div className={styles['contact-info']}>
                                <div className={styles['info-item']}>
                                    <MdOutlineEmail className={styles['icon-email']} />
                                    <span>khongnhodau1993@gm...</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <MdLocalPhone className={styles['icon-phone']} />
                                    <span>Số điện thoại</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <LiaBirthdayCakeSolid className={styles['icon-calendar']} />
                                    <span>Tuổi</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <PiGenderIntersexLight className={styles['icon-gender']} />
                                    <span>Giới tính</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <CiLocationOn className={styles['icon-location']} />
                                    <span>Địa chỉ hiện tại</span>
                                </div>
                                <div className={styles['info-item']}>
                                    <CiLink className={styles['icon-link']} />
                                    <span>Link cá nhân</span>
                                </div>
                            </div>
                        </div>
                        <FaRegEdit className={styles['edit-button']} />
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAccount;