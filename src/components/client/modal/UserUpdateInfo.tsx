import { Button, Col, Form, Input, Row, Select, message, notification } from "antd";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { callFetchUserById, callUpdateUser } from '@/config/api';
import { IUser } from '@/types/backend';
import { AxiosError } from 'axios';
import user from "pages/admin/user";
import {values} from "lodash";

const UserUpdateInfo = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);

    const fetchUserById = async () => {
        if (!user.id) return;

        setLoading(true);
        try {
            const res = await callFetchUserById(user.id);

            if (res?.data) {
                const userData = res.data;
                form.setFieldsValue({
                    email: userData.email,
                    name: userData.name,
                    age: userData.age,
                    gender: userData.gender,
                    address: userData.address
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            notification.error({
                message: 'Có lỗi xảy ra',
                description: axiosError.response?.data?.message || 'Không thể lấy thông tin người dùng'
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserById();
    }, [user.id]);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const userData: IUser = {
                post_count: 0,
                id: user.id,
                email: values.email,
                phoneNumber: values.phoneNumber,
                urlAvatar: values.urlAvatar,
                urlProfile: values.urlProfile,
                name: values.name,
                age: values.age,
                gender: values.gender,
                address: values.address
            };

            const res = await callUpdateUser(userData);
            if (res.data) {
                message.success('Cập nhật thông tin thành công');
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            notification.error({
                message: 'Có lỗi xảy ra',
                description: axiosError.response?.data?.message || 'Không thể cập nhật thông tin người dùng'
            });
        }
        setLoading(false);
    };


    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
            >
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng nhập tuổi!' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                        >
                            <Select>
                                <Select.Option value="MALE">Nam</Select.Option>
                                <Select.Option value="FEMALE">Nữ</Select.Option>
                                <Select.Option value="OTHER">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                loading={loading}
                            >
                                Cập nhật thông tin
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default UserUpdateInfo;