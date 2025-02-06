import icon from '@/assets/box.svg';
import styles from '@/styles/profile.module.scss';
import { Select } from 'antd';
import React, { useState } from 'react';
import HeaderWithoutSearch from './header.withprofile';
import ProfileSidebar from './ProfileSidebar';
const { Option } = Select;

const MyJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('applied');
    const [sortBy, setSortBy] = useState('latest');

    return (
        <div className={styles['layout-container']}>
            <HeaderWithoutSearch
                className={styles['header-override']}
                searchTerm={''}
                setSearchTerm={() => { }}
            />
            <div className={styles['profile-container']}>
                <ProfileSidebar activePage='my-jobs' />
                <div className={styles['profile-content']}>
                    <h1 className={styles['content-title']}>Việc làm của tôi</h1>
                    <div className={styles['job-tabs']}>
                        <button
                            className={`${styles['tab']} ${activeTab === 'applied' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('applied')}
                        >
                            Đã ứng tuyển
                        </button>
                        <button
                            className={`${styles['tab']} ${activeTab === 'saved' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            Đã lưu
                        </button>
                    </div>
                    <div className={styles['job-list-container']}>
                        <div className={styles['job-list-header']}>
                            <h2>Việc làm đã ứng tuyển (0)</h2>
                            <div className={styles['sort-container']}>
                                <span>Sắp xếp theo:</span>
                                <Select
                                    defaultValue="latest"
                                    style={{ width: 200 }}
                                    onChange={(value) => setSortBy(value)}
                                >
                                    <Option value="latest">Việc làm mới nhất</Option>
                                    <Option value="expiringSoon">Ngày hết hạn gần nhất</Option>
                                </Select>
                            </div>
                        </div>
                        <div className={styles['job-list']}>
                            <div className={styles['empty-state']}>

                                <img src={icon} alt="icon" />
                                <p>Bạn có 0 Việc làm đã ứng tuyển</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;