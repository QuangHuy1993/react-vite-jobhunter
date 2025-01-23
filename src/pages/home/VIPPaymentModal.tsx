import React, { useState } from 'react';
import { Modal, Select, Divider } from 'antd';
import { IPostLimit } from '@/types/backend';
import styles from '@/styles/client.module.scss';

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

        // Tìm giảm giá (nếu có) dựa trên số tháng đã chọn
        const selectedOption = monthOptions.find(option => option.value === selectedMonths);
        const discount = selectedOption?.discount || 0;

        // Tính tổng tiền với giảm giá
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
            title="Xác nhận mua gói VIP"
            open={isVisible}
            onOk={handleConfirm}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Xác nhận thanh toán"
            cancelText="Hủy"
            width={500}
        >
            <div className={styles.modalContent}>
                {/* Phần thông tin gói */}
                <div className={styles.planInfo}>
                    <h3 className="text-blue-600">{selectedPlan.planName}</h3>
                    <p>Số bài đăng: {selectedPlan.maxPostsPerMonth} bài/tháng</p>
                </div>

                <Divider />

                {/* Phần chọn thời hạn */}
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

                {/* Phần thông tin giá */}
                <div className={styles.priceBreakdown}>
                    <div className={styles.priceRow}>
                        <span>Giá gói/tháng:</span>
                        <span>{selectedPlan.price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>

                    <div className={styles.priceRow}>
                        <span>Thời hạn:</span>
                        <span>{selectedMonths} tháng</span>
                    </div>

                    {discount > 0 && (
                        <>
                            <div className={styles.priceRow}>
                                <span>Tạm tính:</span>
                                <span>{originalPrice.toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                            <div className={`${styles.priceRow} ${styles.discount}`}>
                                <span>Giảm giá:</span>
                                <span>-{discount}%</span>
                            </div>
                        </>
                    )}

                    <Divider className="my-3" />

                    <div className={styles.totalPrice}>
                        <span>Tổng tiền:</span>
                        <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VIPPaymentModal;