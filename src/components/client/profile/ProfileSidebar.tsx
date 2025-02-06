import styles from '@/styles/profile.module.scss';
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { CiBoxList, CiSettings } from "react-icons/ci";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { Link } from 'react-router-dom';

interface ProfileSidebarProps {
    activePage: 'profile' | 'my-jobs' | 'email-subscription' | 'settings';
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activePage }) => {
    return (
        <div className={styles['profile-sidebar']}>
            <div className={styles['profile-greeting']}>
                <span className={styles['greeting-icon']}>👋</span>
                <div>
                    <div>Xin chào</div>
                    <div className={styles['user-name']}>Quang Huy</div>
                </div>
            </div>

            <nav className={styles['profile-menu']}>
                <Link to="/profile" className={`${styles['menu-item']} ${activePage === 'profile' ? styles['active'] : ''}`}>
                    <CgProfile className={styles['icon-profile']} />
                    Hồ sơ của tôi
                </Link>
                <Link to="/profile/my-jobs" className={`${styles['menu-item']} ${activePage === 'my-jobs' ? styles['active'] : ''}`}>
                    <CiBoxList className={styles['icon-work']} />
                    Việc làm của tôi
                </Link>
                <Link to="/profile/email-subscription" className={`${styles['menu-item']} ${activePage === 'email-subscription' ? styles['active'] : ''}`}>
                    <MdOutlineMarkEmailRead className={styles['icon-email']} />
                    Đăng ký nhận email
                </Link>
                <Link to="/profile/settings" className={`${styles['menu-item']} ${activePage === 'settings' ? styles['active'] : ''}`}>
                    <CiSettings className={styles['icon-settings']} />
                    Cài đặt
                </Link>
            </nav>
        </div>
    );
};

export default ProfileSidebar;