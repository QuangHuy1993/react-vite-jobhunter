import { useState } from 'react';
import ContactRequestPage from './contact-request';
import SendEmailPage from './send-email-confirm-contact';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import styles from './contact-request.tabs.module.scss';

const ContactRequestTabs = () => {
    const [activeTab, setActiveTab] = useState('1');

    const tabs = [
        {
            key: '1',
            label: 'Quản lý Contact Request',
            icon: '📋'
        },
        {
            key: '2',
            label: 'Gửi Email Xác Nhận',
            icon: '✉️'
        }
    ];

    return (
        <div className={styles.tabsContainer}>
            <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
                <div className={styles.tabHeaders}>
                    {tabs.map(tab => (
                        <button 
                            key={tab.key}
                            className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className={styles.tabContent}>
                    {activeTab === '1' ? <ContactRequestPage /> : <SendEmailPage />}
                </div>
            </Access>
        </div>
    );
};

export default ContactRequestTabs;