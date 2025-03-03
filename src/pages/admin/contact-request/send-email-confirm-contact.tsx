import { callCheckContactRequestEmail, callFetchApprovedContactRequests, callSendRecruiterActivationEmail } from '@/config/api';
import { IContactRequest, IUser } from '@/types/backend';
import { Spin } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useEffect, useState } from 'react';
import styles from './send-email.module.scss';

const DEFAULT_PASSWORD = '123456';
// Khởi tạo Notyf
const notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
    types: [
        {
            type: 'success',
            background: '#34d399',
            icon: false
        },
        {
            type: 'error',
            background: '#f87171',
            icon: false
        },
        {
            type: 'warning',
            background: '#fbbf24',
            icon: false
        },
        {
            type: 'info',
            background: '#60a5fa', // Màu xanh thông tin
            icon: false
        }
    ]
});

const SendEmailPage = () => {
    const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
    const [approvedRequests, setApprovedRequests] = useState<IContactRequest[]>([]);
    const [userData, setUserData] = useState<IUser | null>(null);

    // Khởi tạo AOS khi component mount
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true
        });
    }, []);

    const fetchApprovedRequests = async () => {
        setLoading(true);
        try {
            const response = await callFetchApprovedContactRequests();
            if (response.data) {
                setApprovedRequests(response.data);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách yêu cầu liên hệ đã duyệt:', error);
            notyf.error('Không thể tải danh sách yêu cầu liên hệ đã duyệt');
        } finally {
            setLoading(false);
        }
    };
    // Fetch approved contact requests when component mounts
    useEffect(() => {
        fetchApprovedRequests();
    }, []);

    // Kiểm tra email khi chọn contact request
    const handleSelectRequest = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const requestId = Number(e.target.value);
        setSelectedRequest(requestId);

        if (requestId) {
            const selectedContact = approvedRequests.find(req => req.id === requestId);
            if (selectedContact && selectedContact.email) {
                setCheckingEmail(true);
                try {
                    const response = await callCheckContactRequestEmail(selectedContact.email);
                    if (response.data) {
                        if (response.data.exists && response.data.userData) {
                            setUserData(response.data.userData);
                            notyf.success('Đã tìm thấy thông tin tài khoản');
                        } else {
                            setUserData(null);
                            notyf.open({
                                type: 'warning',
                                message: 'Email chưa có tài khoản trong hệ thống'
                            });
                        }
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra email:', error);
                    notyf.error('Không thể kiểm tra thông tin email');
                } finally {
                    setCheckingEmail(false);
                }
            }
        } else {
            setUserData(null);
        }
    };

    const handleSendEmail = async () => {
        if (!selectedRequest) return;

        setIsSending(true);
        // Hiển thị thông báo đang gửi email
        const sendingToast = notyf.open({
            type: 'info',
            message: 'Đang gửi email, vui lòng đợi...',
            duration: 0 // Thông báo sẽ không tự đóng
        });

        try {
            const selectedContact = approvedRequests.find(req => req.id === selectedRequest);
            if (!selectedContact) {
                notyf.error('Không tìm thấy thông tin yêu cầu liên hệ');
                return;
            }

            // Chuẩn bị dữ liệu để gửi email xác nhận
            const emailData = {
                // Nếu có userData thì sử dụng email, name, companyName từ userData
                // Ngược lại sử dụng thông tin từ selectedContact
                email: userData?.email || selectedContact.email,
                name: userData?.name || selectedContact.fullName,
                companyName: userData?.company?.name || selectedContact.companyName,
                password: DEFAULT_PASSWORD,
                contactRequestId: selectedContact.id
            };

            // Gọi API gửi email
            const response = await callSendRecruiterActivationEmail(emailData);

            // Đóng thông báo đang gửi
            notyf.dismiss(sendingToast);

            if (response.data) {
                notyf.success('Gửi email xác nhận thành công');
                setSelectedRequest(null);
                setUserData(null);

                await fetchApprovedRequests();
            } else {
                notyf.error(response.message || 'Có lỗi xảy ra');
            }
        } catch (error: any) {
            // Đóng thông báo đang gửi nếu có lỗi
            notyf.dismiss(sendingToast);
            notyf.error(error.response?.data?.message || 'Đã có lỗi xảy ra khi gửi email');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 data-aos="fade-down">✉️ Gửi Email Xác Nhận Tài Khoản</h1>

            <div className={styles.emailForm} data-aos="fade-up">
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>📋 Chọn yêu cầu liên hệ</h3>
                    <div className={styles.selectContainer}>
                        <label htmlFor="requestSelect">
                            <span className={styles.emoji}>👥</span> Danh sách yêu cầu:
                        </label>
                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <Spin size="small" />
                                <span>Đang tải danh sách...</span>
                            </div>
                        ) : (
                            <select
                                id="requestSelect"
                                value={selectedRequest || ''}
                                onChange={handleSelectRequest}
                                className={styles.select}
                                disabled={checkingEmail}
                            >
                                <option value="">-- Chọn yêu cầu --</option>
                                {approvedRequests.map((request) => (
                                    <option key={request.id} value={request.id}>
                                        {request.isEmailSent ? '✅ ' : ''}{request.fullName} - {request.email}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                {checkingEmail && (
                    <div className={styles.checkingContainer} data-aos="fade">
                        <Spin size="small" />
                        <span>Đang kiểm tra thông tin tài khoản...</span>
                    </div>
                )}

                {selectedRequest && !checkingEmail && userData && (
                    <div className={styles.userInfoSection} data-aos="fade-up">
                        <h3 className={styles.sectionTitle}>👤 Thông tin người dùng hiện có</h3>

                        <div className={styles.userInfoGrid}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">
                                    <span className={styles.emoji}>📧</span> Email:
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    value={userData.email || ''}
                                    readOnly
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="password">
                                    <span className={styles.emoji}>🔐</span> Mật khẩu:
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    value={DEFAULT_PASSWORD}
                                    readOnly
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="name">
                                    <span className={styles.emoji}>👤</span> Họ và tên:
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userData.name || ''}
                                    readOnly
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="company">
                                    <span className={styles.emoji}>🏢</span> Công ty:
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    value={userData.company?.name || ''}
                                    readOnly
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="role">
                                    <span className={styles.emoji}>🔰</span> Vai trò:
                                </label>
                                <input
                                    type="text"
                                    id="role"
                                    value={userData.role?.name || ''}
                                    readOnly
                                    className={styles.inputField}
                                />
                            </div>
                        </div>

                        <div className={styles.infoMessage} data-aos="fade">
                            <div className={styles.warningInfo}>
                                <span className={styles.infoIcon}>⚠️</span>
                                <span>Email đã có tài khoản trong hệ thống. Hệ thống sẽ gửi email thông báo.</span>
                            </div>
                        </div>
                    </div>
                )}

                {selectedRequest && !checkingEmail && !userData && (
                    <div className={styles.infoMessage} data-aos="fade">
                        <div className={styles.successInfo}>
                            <span className={styles.infoIcon}>ℹ️</span>
                            <span>Email chưa có tài khoản trong hệ thống. Hệ thống sẽ tạo tài khoản mới và gửi email với thông tin đăng nhập.</span>
                        </div>
                    </div>
                )}

                <button
                    className={styles.sendButton}
                    onClick={handleSendEmail}
                    disabled={!selectedRequest || isSending || checkingEmail}
                    data-aos="zoom-in"
                >
                    <span className={styles.buttonIcon}>📨</span>
                    {isSending ? 'Đang gửi...' : 'Gửi Email Xác Nhận'}
                </button>
            </div>
        </div>
    );
};

export default SendEmailPage;