import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { fetchAccount } from '@/redux/slice/accountSlide';
import { message, Spin } from 'antd';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isFirstRender = useRef(true);
    const location = useLocation();

    useEffect(() => {
        const handleSocialLogin = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const access_token = urlParams.get('access_token');
                const isGoogle = location.pathname.includes('google');
                const provider = isGoogle ? 'Google' : 'Facebook';

                if (access_token) {
                    localStorage.setItem('access_token', access_token);
                    const result = await dispatch(fetchAccount()).unwrap();

                    if (result?.user) {
                        if (isFirstRender.current) {
                            message.success(`Đăng nhập ${provider} thành công!`);
                            isFirstRender.current = false;
                        }
                        navigate('/');
                    } else {
                        message.error('Đã có lỗi xảy ra!');
                        navigate('/login');
                    }
                } else {
                    message.error('Không tìm thấy token!');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Login error:', error);
                message.error('Đã có lỗi xảy ra trong quá trình đăng nhập!');
                navigate('/login');
            }
        };

        // Set timeout để tránh loading vô tận
        const timeoutId = setTimeout(() => {
            message.error('Quá thời gian xử lý, vui lòng thử đăng nhập lại');
            navigate('/login');
        }, 15000); // 15 seconds timeout

        handleSocialLogin();

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
        };
    }, [dispatch, navigate, location]);

    const isGoogle = location.pathname.includes('google');
    const provider = isGoogle ? 'Google' : 'Facebook';

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
        }}>
            <Spin size="large" />
            <div>Đang xử lý đăng nhập với {provider}...</div>
        </div>
    );
};

export default OAuthCallback;