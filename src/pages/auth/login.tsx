import LoadingSpinner from '@/components/share/LoadingSpinner';
import { useAppSelector } from '@/redux/hooks';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Button, Divider, Form, Input } from 'antd';
import { callLogin } from 'config/api';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from 'styles/auth.module.scss';


const LoginPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const callback = params?.get("callback");

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const socialButtonsVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { staggerChildren: 0.1 }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = '/';
        }
    }, [])

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);

        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            toast.success('Đăng nhập tài khoản thành công!');
            window.location.href = callback ? callback : '/';
        } else {
            toast.error(res.message && Array.isArray(res.message) ? res.message[0] : res.message);
        }
    };

    return (
        <>
            {isSubmit && <LoadingSpinner />}
            <div className={styles["login-page"]}>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <motion.section
                            className={styles.wrapper}
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.heading}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>Đăng Nhập</h2>
                                <Divider />
                            </div>
                            <Form
                                name="basic"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="username"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>
                                <Divider>Hoặc sử dụng</Divider>
                                <motion.div
                                    className={styles["social-buttons"]}
                                    variants={socialButtonsVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Button
                                        className={styles["social-btn"]}
                                        onClick={() => {
                                            window.location.href = 'http://localhost:8080/oauth2/authorization/google';
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "40px",
                                            width: "50%",
                                            border: "1px solid #dadce0",
                                            backgroundColor: "#fff",
                                            color: "#333",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: 500
                                        }}
                                    >
                                        <FcGoogle size={20} style={{ marginRight: '8px' }} />
                                        Google
                                    </Button>

                                    <Button
                                        className={styles["social-btn"]}
                                        onClick={() => {
                                            window.location.href = 'http://localhost:8080/oauth2/authorization/facebook';
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "40px",
                                            width: "50%",
                                            border: "1px solid #1877f2",
                                            backgroundColor: "#1877f2",
                                            color: "#fff",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: 500
                                        }}
                                    >
                                        <FaFacebook size={20} style={{ marginRight: '8px' }} />
                                        Facebook
                                    </Button>
                                </motion.div>

                                <p className="text text-normal">Chưa có tài khoản ?
                                    <span>
                                        <Link to='/register'> Đăng Ký </Link>
                                    </span>
                                </p>
                                <p className="text text-normal">
                                    <Link to='/forget-password'>Quên mật khẩu?</Link>
                                </p>
                            </Form>
                        </motion.section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default LoginPage;