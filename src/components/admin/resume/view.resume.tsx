import { callUpdateResumeStatus } from "@/config/api";
import { IResume } from "@/types/backend";
import { Badge, Button, Descriptions, Drawer, Form, Select, message, notification, Space } from "antd";
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { FileOutlined } from '@ant-design/icons';
const { Option } = Select;

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IResume | null | any;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ViewDetailResume = (props: IProps) => {
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { onClose, open, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();

    const handleChangeStatus = async () => {
        setIsSubmit(true);
        try {
            const values = await form.validateFields();
            const res = await callUpdateResumeStatus(dataInit?.id, values.status);
            if (res.data) {
                message.success("Update Resume status thành công!");
                setDataInit(null);
                onClose(false);
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsSubmit(false);
        }
    }

    const handleViewCV = () => {
        if (!dataInit?.url) {
            message.error("Không tìm thấy CV của ứng viên");
            return;
        }

        try {
            const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
            const fileURL = `${baseURL}/storage/resume/${dataInit.url}`;

            // Mở file trong tab mới
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error('Error viewing CV:', error);
            notification.error({
                message: 'Không thể xem CV',
                description: 'Vui lòng thử lại sau'
            });
        }
    }

    useEffect(() => {
        if (dataInit) {
            form.setFieldsValue({
                status: dataInit.status
            });
        }
        return () => form.resetFields();
    }, [dataInit, form]);

    return (
        <>
            <Drawer
                title="Thông Tin Resume"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
                destroyOnClose
                extra={
                    <Button loading={isSubmit} type="primary" onClick={handleChangeStatus}>
                        Change Status
                    </Button>
                }
            >
                <Form form={form} initialValues={{ status: dataInit?.status }}>
                    <Descriptions title="" bordered column={2} layout="vertical">
                        <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Form.Item name="status" noStyle>
                                <Select style={{ width: "100%" }}>
                                    <Option value="PENDING">PENDING</Option>
                                    <Option value="REVIEWING">REVIEWING</Option>
                                    <Option value="APPROVED">APPROVED</Option>
                                    <Option value="REJECTED">REJECTED</Option>
                                </Select>
                            </Form.Item>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Job">
                            {dataInit?.job?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên Công Ty">
                            {dataInit?.companyName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày tạo">
                            {dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sửa">
                            {dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label="CV của ứng viên">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%'
                            }}>
                                <Button
                                    icon={<FileOutlined />}
                                    onClick={handleViewCV}
                                    type="primary"
                                >
                                    Xem CV
                                </Button>
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Form>
            </Drawer>
        </>
    );
}

export default ViewDetailResume;