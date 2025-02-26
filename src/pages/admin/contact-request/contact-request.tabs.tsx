import { useState } from 'react';
import ContactRequestPage from './contact-request';
import SendEmailPage from './send-email-confirm-contact';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import styles from './contact-request.module.scss';

const ContactRequestTabs = () => {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey);
    };

    return (
        <div className={styles.tabsContainer}>
            <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}>
                <div className={styles.tabHeaders}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === '1' ? styles.active : ''}`}
                        onClick={() => handleTabChange('1')}
                    >
                        Quản lý Contact Request
                        <div className={styles.activeIndicator}></div>
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === '2' ? styles.active : ''}`}
                        onClick={() => handleTabChange('2')}
                    >
                        Send Email
                        <div className={styles.activeIndicator}></div>
                    </button>
                </div>
                <div className={styles.tabContent}>
                    {activeTab === '1' ? <ContactRequestPage /> : <SendEmailPage />}
                </div>
            </Access>
        </div>
    );
}

export default ContactRequestTabs;