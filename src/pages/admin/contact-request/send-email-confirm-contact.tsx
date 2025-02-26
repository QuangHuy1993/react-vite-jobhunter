import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import styles from './send-email.module.scss';

const SendEmailPage = () => {
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [emailContent, setEmailContent] = useState('');
    const { contactRequests } = useAppSelector((state) => state.contactRequest);

    const handleSendEmail = async () => {
        if (!selectedRequest || !emailContent.trim()) return;
        
        try {
            // TODO: Implement email sending logic here
            console.log('Sending email for request:', selectedRequest);
            
            setSelectedRequest(null);
            setEmailContent('');
        } catch (error) {
            console.error('Failed to send email:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Gửi Email Xác Nhận</h1>
            
            <div className={styles.emailForm}>
                <div className={styles.selectContainer}>
                    <label htmlFor="requestSelect">Chọn Contact Request:</label>
                    <select
                        id="requestSelect"
                        value={selectedRequest || ''}
                        onChange={(e) => setSelectedRequest(Number(e.target.value))}
                        className={styles.select}
                    >
                        <option value="">-- Chọn request --</option>
                        {contactRequests.map((request) => (
                            <option key={request.id} value={request.id}>
                                {request.fullName} - {request.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.editorContainer}>
                    <label htmlFor="emailContent">Nội dung email:</label>
                    <div className={styles.toolbar}>
                        <button onClick={() => setEmailContent(prev => prev + '**Bold**')}>B</button>
                        <button onClick={() => setEmailContent(prev => prev + '*Italic*')}>I</button>
                        <button onClick={() => setEmailContent(prev => prev + '[Link](url)')}>Link</button>
                        <button onClick={() => setEmailContent(prev => prev + '\n\n')}>Break</button>
                    </div>
                    <textarea
                        id="emailContent"
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        placeholder="Nhập nội dung email..."
                        className={styles.editor}
                        rows={10}
                    />
                </div>

                <div className={styles.preview}>
                    <h3>Xem trước</h3>
                    <div className={styles.previewContent}>
                        {emailContent.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>

                <button 
                    className={styles.sendButton}
                    onClick={handleSendEmail}
                    disabled={!selectedRequest || !emailContent.trim()}
                >
                    Gửi Email
                </button>
            </div>
        </div>
    );
};

export default SendEmailPage;