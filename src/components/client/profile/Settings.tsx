import styles from '@/styles/profile.module.scss';
import React from 'react';
import { PiSealWarning } from "react-icons/pi";
import { Link } from 'react-router-dom';
import HeaderWithoutSearch from './header.withprofile';
import ProfileSidebar from './ProfileSidebar';
const Settings: React.FC = () => {
    return (
        <div className={styles['layout-container']}>
            <HeaderWithoutSearch
                className={styles['header-override']}
                searchTerm={''}
                setSearchTerm={() => { }}
            />
            <div className={styles['profile-container']}>
                <ProfileSidebar activePage="settings" />
                <div className={styles['profile-content']}>
                    <div className={styles['settings-section']}>
                        <h2>Tài khoản</h2>
                        <div className={styles['settings-info']}>
                            <h3>Thông tin chung</h3>
                            <div className={styles['info-item']}>
                                <span>Email:</span>
                                <span>
                                    khongnhodau1993@gmail.com
                                    <div className={styles.tooltip}>
                                        <PiSealWarning className={styles['email-warning']} />
                                        <span className={styles['tooltip-text']}>Không thể thay đổi email đăng nhập</span>
                                    </div>
                                </span>
                            </div>
                            <div className={styles['info-item']}>
                                <span>Họ và Tên:</span>
                                <span>Quang Huy</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['settings-section']}>
                        <h2>Xoá tài khoản</h2>
                        <p>
                            Thao tác xoá tài khoản là vĩnh viễn và không thể hoàn tác. Nếu bạn xoá tài khoản vì nhận quá nhiều email từ ITviec, bạn có thể huỷ đăng ký email <Link to="/profile/email-subscription">tại đây</Link>.
                        </p>
                        <div className={styles['delete-account-container']}>
                            <button className={styles['delete-account-btn']}>Xoá tài khoản</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;