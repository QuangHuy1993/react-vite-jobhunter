import { Modal, Form, Input, InputNumber, message, notification } from 'antd';
import { useState, useEffect } from 'react';
import { IPostLimit } from '@/types/backend';
import { useAppDispatch } from '@/redux/hooks';
import { callCreatePostLimit, callUpdatePostLimit } from '@/config/api';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IPostLimit | null;
    setDataInit: (v: IPostLimit | null) => void;
    reloadTable: () => void;
}

const ModalPostLimit = (props: IProps) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        if (dataInit) {
            form.setFieldsValue({
                planName : dataInit.planName,
                maxPostsPerMonth: dataInit.maxPostsPerMonth,
                price: dataInit.price,
                description: dataInit.description,
            });
        }
    }, [dataInit]);

    const handleSubmit = async () => {
        try {
            setConfirmLoading(true);
            const values = await form.validateFields();
            if (dataInit?.id) {
                const res = await callUpdatePostLimit(dataInit.id, values);
                if (res && +res.statusCode === 200) {
                    message.success('Cập nhật Post Limit thành công');
                    handleReset();
                    reloadTable();
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            } else {
                const res = await callCreatePostLimit(values);
                if (res && +res.statusCode === 201) {
                    message.success('Thêm mới Post Limit thành công');
                    handleReset();
                    reloadTable();
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    return (
        <Modal
            title={dataInit?.id ? "Cập nhật Post Limit" : "Tạo mới Post Limit"}
            open={openModal}
            onOk={handleSubmit}
            confirmLoading={confirmLoading}
            onCancel={handleReset}
            maskClosable={false}
        >
            <Form
                name="basic"
                style={{ maxWidth: 800, margin: '0 auto' }}
                initialValues={{ remember: true }}
                form={form}
                autoComplete="off"
            >
                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Tên gói"
                    name="planName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên gói!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Số lượng bài đăng tối đa/tháng"
                    name="maxPostsPerMonth"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng bài đăng!' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Giá (VND)"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                    />
                </Form.Item>

                <Form.Item
                    labelCol={{ span: 24 }}
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalPostLimit;