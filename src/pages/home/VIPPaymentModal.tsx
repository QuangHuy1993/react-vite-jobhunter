import paypalLogo from '@/assets/paypal_logo.png';
import vnpayLogo from '@/assets/vnpay_logo.jpg';
import styles from '@/styles/donate.module.scss';
import { IPostLimit } from '@/types/backend';
import { CheckCircleFilled, CrownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Tooltip } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface VIPPaymentModalProps {
    isVisible: boolean;
    selectedPlan: IPostLimit | null;
    loading: boolean;
    onConfirm: (paymentData: {
        planId: number;
        amount: number;
        orderInfo: string;
        months: number;
    }) => void;
    onCancel: () => void;
}

const VIPPaymentModal: React.FC<VIPPaymentModalProps> = ({
    isVisible,
    selectedPlan,
    loading,
    onConfirm,
    onCancel
}) => {
    const [selectedMonths, setSelectedMonths] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('vnpay');

    interface MonthOption {
        value: number;
        label: string;
        discount?: number;
    }

    const monthOptions: MonthOption[] = [
        { value: 1, label: '1 tháng' },
        { value: 3, label: '3 tháng', discount: 5 },
        { value: 6, label: '6 tháng', discount: 10 },
        { value: 12, label: '12 tháng', discount: 15 }
    ];

    const calculateTotalPrice = () => {
        if (!selectedPlan) return 0;
        const selectedOption = monthOptions.find(option => option.value === selectedMonths);
        const discount = selectedOption?.discount || 0;
        const basePrice = selectedPlan.price * selectedMonths;
        const discountAmount = (basePrice * discount) / 100;
        return basePrice - discountAmount;
    };

    const handleConfirm = () => {
        if (!selectedPlan) return;
        if (paymentMethod === 'paypal') {
            toast.warning("Chức năng đang bảo trì, Vui lòng quay lại sau");
            return;
        }
        const totalPrice = calculateTotalPrice();
        onConfirm({
            planId: selectedPlan.id,
            amount: totalPrice,
            orderInfo: `Thanh toán gói ${selectedPlan.planName} - Thời hạn ${selectedMonths} tháng`,
            months: selectedMonths
        });
    };


    const handlePaymentMethodChange = (value: string) => {
        if (value === 'paypal') {
            toast.warning("Chức năng đang bảo trì, Vui lòng quay lại sau");
        }
        setPaymentMethod(value);
    };
    if (!selectedPlan) return null;

    const totalPrice = calculateTotalPrice();
    const selectedOption = monthOptions.find(option => option.value === selectedMonths);
    const discount = selectedOption?.discount || 0;
    const originalPrice = selectedPlan.price * selectedMonths;

    return (
        <Modal
            title={
                <div style={{
                    color: '#991B1B',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <CrownOutlined /> Xác nhận mua gói VIP
                </div>
            }
            open={isVisible}
            footer={null}
            onCancel={onCancel}
            width={700}
            className={styles.vipModal}
        >
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={styles.modalContent}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className={styles.planInfoHeader}>
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                style={{ color: '#991B1B' }}
                            >
                                {selectedPlan.planName}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Số bài đăng: <strong>{selectedPlan.maxPostsPerMonth} bài/tháng</strong>
                            </motion.p>
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        <div className={styles.paymentLayout}>
                            {/* Cột bên trái: Thông tin gói và phương thức thanh toán */}
                            <div className={styles.leftColumn}>
                                <div className={styles.sectionTitle}>
                                    <span>Thời Hạn Đăng Ký</span>
                                </div>

                                <div className={styles.monthSelectionContainer}>
                                    {monthOptions.map(option => (
                                        <div
                                            key={option.value}
                                            className={`${styles.monthOption} ${selectedMonths === option.value ? styles.selectedMonth : ''}`}
                                            onClick={() => setSelectedMonths(option.value)}
                                        >
                                            <div className={styles.monthLabel}>
                                                {option.label}
                                                {option.discount && option.discount > 0 && (
                                                    <span className={styles.discountBadge}>-{option.discount}%</span>
                                                )}
                                            </div>
                                            {selectedMonths === option.value && (
                                                <CheckCircleFilled className={styles.checkIcon} />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                                    <span>Phương Thức Thanh Toán</span>
                                </div>

                                <div className={styles.paymentMethods}>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`${styles.paymentMethodOption} ${paymentMethod === 'vnpay' ? styles.selectedPaymentMethod : ''}`}
                                        onClick={() => setPaymentMethod('vnpay')}
                                    >
                                        <div className={styles.paymentMethod}>
                                            <div className={styles.paymentLogo}>
                                                <img src={vnpayLogo} alt="VNPAY" />
                                            </div>
                                            <div className={styles.paymentInfo}>
                                                <h4>VNPAY</h4>
                                                <p>Thanh toán trực tuyến qua VNPAY</p>
                                            </div>
                                            {paymentMethod === 'vnpay' && (
                                                <CheckCircleFilled className={styles.selectedPayment} />
                                            )}
                                        </div>
                                    </motion.div>

                                    <Tooltip title="Chức năng đang bảo trì, Vui lòng quay lại sau">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`${styles.paymentMethodOption} ${paymentMethod === 'paypal' ? styles.selectedPaymentMethod : ''}`}
                                            onClick={() => handlePaymentMethodChange('paypal')}
                                        >
                                            <div className={styles.paymentMethod}>
                                                <div className={styles.paymentLogo}>
                                                    <img src={paypalLogo} alt="PayPal" />
                                                </div>
                                                <div className={styles.paymentInfo}>
                                                    <h4>PayPal</h4>
                                                    <p>Thanh toán quốc tế qua PayPal</p>
                                                    <span className={styles.maintenanceBadge}>Đang bảo trì</span>
                                                </div>
                                                {paymentMethod === 'paypal' && (
                                                    <CheckCircleFilled className={styles.selectedPayment} />
                                                )}
                                            </div>
                                        </motion.div>
                                    </Tooltip>
                                </div>
                            </div>

                            {/* Cột bên phải: Chi tiết thanh toán */}
                            <div className={styles.rightColumn}>
                                <div className={styles.orderSummary}>
                                    <h4>Chi Tiết Thanh Toán</h4>

                                    <div className={styles.summaryRow}>
                                        <span>Gói:</span>
                                        <span>{selectedPlan.planName}</span>
                                    </div>

                                    <div className={styles.summaryRow}>
                                        <span>Giá gói/tháng:</span>
                                        <span>{selectedPlan.price.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>

                                    <div className={styles.summaryRow}>
                                        <span>Thời hạn:</span>
                                        <span>{selectedMonths} tháng</span>
                                    </div>

                                    {discount > 0 && (
                                        <>
                                            <div className={styles.summaryRow}>
                                                <span>Tạm tính:</span>
                                                <span>{originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                            </div>
                                            <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                                                <span>Giảm giá:</span>
                                                <span>-{discount}% ({(originalPrice * discount / 100).toLocaleString('vi-VN')} VNĐ)</span>
                                            </div>
                                        </>
                                    )}

                                    <Divider style={{ margin: '12px 0' }} />

                                    <div className={styles.totalRow}>
                                        <span>Tổng tiền:</span>
                                        <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>

                                    <div className={styles.paymentNote}>
                                        <InfoCircleOutlined /> Bằng việc tiếp tục, bạn đồng ý với các điều khoản của chúng tôi
                                    </div>

                                    <Button
                                        type="primary"
                                        size="large"
                                        loading={loading}
                                        onClick={handleConfirm}
                                        disabled={paymentMethod === 'paypal'}
                                        className={styles.confirmButton}
                                    >
                                        Xác nhận thanh toán
                                    </Button>

                                    <Button
                                        type="text"
                                        onClick={onCancel}
                                        className={styles.cancelButton}
                                    >
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default VIPPaymentModal;