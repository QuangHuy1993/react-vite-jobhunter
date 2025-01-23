import React, { useState } from 'react';
import styles from 'styles/auth.module.scss';
import { callCheckEmail,callSendOTP,callVerifyOTP,callResetPassword } from 'config/api';
import {Form, Input, Button, message, Divider, notification} from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
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

    // Gửi email và nhận mã OTP
    const handleEmailSubmit = async (values: { email: string }) => {
        setIsSubmit(true);
        // Hiển thị thông báo loading
        message.loading({
            content: 'Đang gửi mã OTP, xin vui lòng chờ...',
            key: 'sendOTP',
            duration: 0
        });

        try {
            const checkEmail = await callCheckEmail(values.email);
            if (checkEmail.data) {
                const sendOTP = await callSendOTP(values.email);
                if (sendOTP.data) {
                    setEmail(values.email);
                    // Đóng thông báo loading và hiển thị thông báo thành công
                    message.success({
                        content: 'Mã OTP đã được gửi đến email của bạn',
                        key: 'sendOTP'
                    });
                    setStep(2);
                }
            } else {
                // Đóng thông báo loading và hiển thị lỗi
                message.error({
                    content: 'Email không tồn tại trong hệ thống',
                    key: 'sendOTP'
                });
            }
        } catch (error: any) {
            // Đóng thông báo loading và hiển thị lỗi
            message.error({
                content: error?.response?.data?.message || 'Đã có lỗi xảy ra',
                key: 'sendOTP'
            });
        } finally {
            setIsSubmit(false);
        }
    };

    // Xác thực mã OTP
    const handleOTPSubmit = async (values: { otp: string }) => {
        setIsVerifying(true);

        // Tạo một promise cho timeout
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('timeout'));
            }, 1000); // 1 giây timeout
        });

        try {
            // Race giữa call API và timeout
            const response = await Promise.race([
                callVerifyOTP(email, values.otp),
                timeoutPromise
            ]);

            // Kiểm tra response một cách an toàn hơn
            if (response && typeof response === 'object' && 'data' in response) {
                message.success('Xác thực OTP thành công');
                setStep(3);
            } else {
                throw new Error('Invalid response');
            }


        } catch (error: any) {
            let errorMessage = 'Mã OTP không hợp lệ hoặc đã hết hạn';

            // Xử lý các loại lỗi khác nhau
            if (error.message === 'timeout') {
                errorMessage = 'Mã OTP không hợp lệ hoặc đã hết hạn';
            } else if (error.message === 'Invalid response') {
                errorMessage = 'Xác thực OTP thất bại, vui lòng thử lại';
            } else {
                errorMessage = error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn';
            }

            // Hiển thị thông báo lỗi
            notification.error({
                message: 'Xác thực thất bại',
                description: errorMessage,
                duration: 5
            });

            // Reset form và hiển thị lỗi
            form.setFields([
                {
                    name: 'otp',
                    value: '', // Xóa giá trị input
                    errors: [errorMessage]
                }
            ]);
        } finally {
            setIsVerifying(false);
        }
    };

    // Đôi mật khẩu
    const handlePasswordReset = async (values: { password: string; confirmPassword: string }) => {
        try {
            if (values.password !== values.confirmPassword) {
                message.error('Mật khẩu xác nhận không khớp');
                return;
            }

            const res = await callResetPassword(email, values.password);
            if (res.data) {
                message.success('Đổi mật khẩu thành công');
                navigate('/login');
            }
        } catch (error: any) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: error?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại",
                duration: 5
            });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Form
                        name="forget-password"
                        onFinish={handleEmailSubmit}
                        autoComplete="off"
                    >
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Quên mật khẩu</h2>
                            <Divider />
                        </div>

                        <Form.Item
                            labelCol={{span: 24}}
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Nhập email của bạn" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Xác nhận
                            </Button>
                        </Form.Item>
                        <p style={{ marginTop: '10px' }}>
                            <Link to='/login'>Quay lại đăng nhập</Link>
                        </p>
                    </Form>
                );

            case 2:
                return (
                    <Form
                        form={form}
                        name="otp-verification"
                        onFinish={handleOTPSubmit}
                        autoComplete="off"
                    >
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Nhập mã OTP</h2>
                            <Divider />
                        </div>

                        <p className={styles["text-normal"]}>Mã xác thực đã được gửi đến email: {email}</p>

                        <Form.Item
                            labelCol={{span: 24}}
                            label="Mã OTP"
                            name="otp"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã OTP!' },
                                { len: 6, message: 'Mã OTP phải có 6 số!' }
                            ]}
                        >
                            <Input placeholder="Nhập mã OTP" maxLength={6} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isVerifying}
                                block
                            >
                                {isVerifying ? 'Đang xác thực...' : 'Xác nhận'}
                            </Button>
                        </Form.Item>
                    </Form>
                );

            case 3:
                return (
                    <Form
                        name="reset-password"
                        onFinish={handlePasswordReset}
                        autoComplete="off"
                    >
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}>Đổi mật khẩu</h2>
                            <Divider />
                        </div>

                        <Form.Item
                            labelCol={{span: 24}}
                            label="Mật khẩu mới"
                            name="password"
                            rules={[{ validator: validatePassword }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            labelCol={{span: 24}}
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isSubmit} block>
                                Xác nhận
                            </Button>
                        </Form.Item>
                        <p style={{ marginTop: '10px' }}>
                            <Link to='/login'>Quay lại đăng nhập</Link>
                        </p>
                    </Form>
                );
        }
    };

    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        {renderStep()}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ForgetPassword;