import { callActivateHrAccount } from '@/config/api';
import '@/styles/HrActivationPopup.scss';
import { Spin } from 'antd';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import VerificationInput from 'react-verification-input';

interface HrActivationPopupProps {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userName?: string;
    userEmail: string;
}

const HrActivationPopup: React.FC<HrActivationPopupProps> = ({
    isVisible,
    onClose,
    onSuccess,
    userName = 'Nhà tuyển dụng',
    userEmail
}) => {
    const [activationCode, setActivationCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Hiệu ứng pháo hoa khi kích hoạt thành công
    const triggerConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval: any = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // since particles fall down, start a bit higher than random
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Đảm bảo dọn dẹp interval sau khoảng thời gian nhất định
        setTimeout(() => {
            clearInterval(interval);
        }, duration + 1000);
    };

    const handleActivation = async () => {
        if (activationCode.length !== 6) {
            setError('Vui lòng nhập đủ 6 số mã kích hoạt');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Gọi API kích hoạt tài khoản HR
            const response = await callActivateHrAccount(userEmail, activationCode);

            if (response.data) {
                setShowSuccess(true);
                triggerConfetti();


            } else {
                setError(response.message || 'Có lỗi xảy ra trong quá trình kích hoạt');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Mã kích hoạt không đúng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="hr-activation-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {showSuccess ? (
                        <motion.div
                            className="hr-activation-success-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                        >
                            <motion.div
                                className="success-icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 300
                                }}
                            >
                                ✅
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Chúc mừng! 🎉
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Tài khoản nhà tuyển dụng của bạn đã được kích hoạt thành công!
                            </motion.p>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Giờ đây bạn có thể sử dụng đầy đủ các tính năng của nhà tuyển dụng.
                            </motion.p>
                            <motion.div
                                className="emoji-row"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                🚀 🎯 💼 👩‍💻 👨‍💻
                            </motion.div>
                            <motion.button
                                className="success-button"
                                onClick={onSuccess}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                Bắt đầu ngay
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="hr-activation-modal"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                        >

                            <motion.div
                                className="welcome-icon"
                                animate={{
                                    y: [0, -10, 0],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }
                                }}
                            >
                                🎓
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Chào mừng Nhà Tuyển Dụng Mới! 🌟
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Xin chào <strong>{userName}</strong>! Chúng tôi rất vui khi bạn trở thành nhà tuyển dụng của Jobhunter.
                            </motion.p>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Để kích hoạt tài khoản, vui lòng nhập mã gồm 6 số bạn đã nhận được qua email:
                            </motion.p>

                            <motion.div
                                className="verification-container"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <VerificationInput
                                    value={activationCode}
                                    onChange={setActivationCode}
                                    length={6}
                                    placeholder=""
                                    classNames={{
                                        container: "verification-container",
                                        character: "verification-character",
                                        characterInactive: "verification-character--inactive",
                                        characterSelected: "verification-character--selected",
                                    }}
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    className="error-message"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                className="activate-button"
                                onClick={handleActivation}
                                disabled={loading || activationCode.length !== 6}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {loading ? <Spin size="small" /> : '🚀 Kích hoạt ngay'}
                            </motion.button>

                            <motion.div
                                className="note"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <p>Chưa nhận được mã? Vui lòng kiểm tra hòm thư của bạn hoặc liên hệ với quản trị viên.
                                    SĐT: 0362600321
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HrActivationPopup;