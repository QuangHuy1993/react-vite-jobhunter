import styles from '@/styles/donate.module.scss';
import { IPostLimit } from '@/types/backend';
import { CrownOutlined } from '@ant-design/icons';
import { Divider, Modal, Select } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

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

    const monthOptions = [
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
        const totalPrice = calculateTotalPrice();
        onConfirm({
            planId: selectedPlan.id,
            amount: totalPrice,
            orderInfo: `Thanh toán gói ${selectedPlan.planName} - Thời hạn ${selectedMonths} tháng`,
            months: selectedMonths
        });
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
            onOk={handleConfirm}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Xác nhận thanh toán"
            cancelText="Hủy"
            width={500}
            className={styles.vipModal}
            okButtonProps={{
                style: {
                    backgroundColor: '#991B1B',
                    borderColor: '#991B1B'
                }
            }}
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
                        <div className={styles.planInfo}>
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
                                Số bài đăng: {selectedPlan.maxPostsPerMonth} bài/tháng
                            </motion.p>
                        </div>

                        <Divider style={{ margin: '16px 0' }} />

                        <div className={styles.monthSelection}>
                            <span>Thời hạn:</span>
                            <Select
                                defaultValue={1}
                                style={{ width: 280 }}
                                onChange={setSelectedMonths}
                                options={monthOptions.map(option => ({
                                    value: option.value,
                                    label: `${option.label}${option.discount ? ` (Giảm ${option.discount}%)` : ''}`
                                }))}
                            />
                        </div>

                        <motion.div
                            className={styles.priceBreakdown}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.priceRow}>
                                <span>Giá gói/tháng:</span>
                                <span>{selectedPlan.price.toLocaleString('vi-VN')} VNĐ</span>
                            </div>

                            <div className={styles.priceRow}>
                                <span>Thời hạn:</span>
                                <span>{selectedMonths} tháng</span>
                            </div>

                            {discount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.priceRow}>
                                        <span>Tạm tính:</span>
                                        <span>{originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                    <div className={`${styles.priceRow} ${styles.discount}`}>
                                        <span>Giảm giá:</span>
                                        <span>-{discount}%</span>
                                    </div>
                                </motion.div>
                            )}

                            <Divider style={{ margin: '12px 0' }} />

                            <motion.div
                                className={styles.totalPrice}
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span>Tổng tiền:</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default VIPPaymentModal;