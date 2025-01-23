import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select, Button, message, notification} from 'antd';
import { IPayment } from '@/types/backend';
import { callUpdatePaymentStatus } from 'config/api';

interface PaymentStatusModalProps {
    visible: boolean;
    onClose: () => void;
    payment: IPayment | null;
    onUpdate: () => void;
}



const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({ visible, onClose, payment, onUpdate }) => {
    const [status, setStatus] = useState(payment?.paymentStatus || '');

    useEffect(() => {
        setStatus(payment?.paymentStatus || '');
    }, [payment]);

    const handleUpdate = async () => {
        if (payment) {
            try {
                const res = await callUpdatePaymentStatus(payment.id, status);
                if (+res.statusCode === 200) {
                    message.success(res.message || "Cập nhật trạng thái thanh toán thành công");
                    onUpdate();
                    onClose();
                }
            } catch (err: any) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: err.response?.data?.message || "Cập nhật trạng thái thất bại"
                });
            }
        }
    };

    return (
        <Modal
            open={visible}
            title="Update Payment Status"
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="update" type="primary" onClick={handleUpdate}>
                    Update
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item label="ID">
                    <Input value={payment?.id} disabled />
                </Form.Item>
                <Form.Item label="Mã giao dịch">
                    <Input value={payment?.paymentRef} disabled />
                </Form.Item>
                <Form.Item label="Số tiền">
                    <Input value={payment?.totalPrice} disabled />
                </Form.Item>
                <Form.Item label="Trạng thái" required>
                    <Select value={status} onChange={setStatus}>
                        <Select.Option value="PAYMENT_SUCCEED">PAYMENT_SUCCEED</Select.Option>
                        <Select.Option value="PAYMENT_PENDING">PAYMENT_PENDING</Select.Option>
                        <Select.Option value="PAYMENT_FAILED">PAYMENT_FAILED</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PaymentStatusModal;