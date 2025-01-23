import React from 'react';
import { Button, Col, Form, Row, Input, message } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import {callChangePassword, callUpdateUser} from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { IUser } from '@/types/backend';
import { AxiosError } from 'axios';

interface IFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
43
interface IChangePasswordRequest extends IUser {
    newPassword: string;
}

const ChangePassword = () => {
    const [form] = Form.useForm<IFormValues>();
    const [passwordMatch, setPasswordMatch] = React.useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);

    // Regex để kiểm tra password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

    const validatePassword = (_: any, value: string): Promise<void> => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập mật khẩu!'));
        }
        if (!passwordRegex.test(value)) {
            return Promise.reject(new Error('Mật khẩu phải có chữ cái đầu viết hoa, bao gồm số và chữ, ít nhất 6 ký tự!'));
        }
        return Promise.resolve();
    };

    const onFinish = async (values: IFormValues) => {
        try {
            const res = await callChangePassword(user.id, {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });

            if (res.data) {
                message.success("Đổi mật khẩu thành công");
                form.resetFields();
            } else {
                message.error("Có lỗi xảy ra khi đổi mật khẩu");
            }
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            message.error(axiosError.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu");
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = form.getFieldValue('newPassword');
        const confirmPassword = e.target.value;
        setPasswordMatch(newPassword === confirmPassword && confirmPassword !== '');
    };

    return (
        <Form<IFormValues>
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="max-w-lg mx-auto"
        >
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }
                        ]}
                        validateTrigger={['onChange', 'onBlur']}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                            { validator: validatePassword }
                        ]}
                        validateTrigger={['onChange', 'onBlur']}
                        help="Mật khẩu phải có chữ cái đầu viết hoa, bao gồm số và chữ, ít nhất 6 ký tự (VD: Daohuy2003)"
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            onChange={() => {
                                form.validateFields(['confirmPassword'])
                                    .catch(() => {/* Ignore validation error */});
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                        validateTrigger={['onChange', 'onBlur']}
                    >
                        <Input.Password
                            placeholder="Xác nhận mật khẩu mới"
                            onChange={handleConfirmPasswordChange}
                            suffix={
                                form.getFieldValue('confirmPassword') ? (
                                    passwordMatch ?
                                        <CheckCircleFilled className="text-green-500" /> :
                                        <CloseCircleFilled className="text-red-500" />
                                ) : null
                            }
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Đổi mật khẩu
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default ChangePassword;