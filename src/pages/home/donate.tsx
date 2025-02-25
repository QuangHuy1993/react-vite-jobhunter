import { callCreatePayment, callFetchPostLimits, callFetchSubscriptionStatus } from '@/config/api';
import { RootState } from '@/redux/store';
import styles from '@/styles/donate.module.scss';
import { ExpirationInfo, IPaymentRequest, IPostLimit, ISubscription } from "@/types/backend";
import { ArrowLeftOutlined, CheckCircleOutlined, CrownOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Row, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import VIPPaymentModal from './VIPPaymentModal';


const formatExpirationDate = (timeRemainingInSeconds?: string): ExpirationInfo => {
    const remainingSeconds = timeRemainingInSeconds ? parseInt(timeRemainingInSeconds) : 0;
    const expirationDate = new Date(Date.now() + remainingSeconds * 1000);

    // Tính số ngày còn lại
    const daysRemaining = Math.ceil(remainingSeconds / (24 * 60 * 60));

    const formattedDate = expirationDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return {
        formattedDate,
        daysRemaining
    };
};

const DonatePage = () => {
    const userId = useSelector((state: RootState) => state.account.user?.id);
    const navigate = useNavigate();
    const [postLimits, setPostLimits] = useState<IPostLimit[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<IPostLimit | null>(null);
    const [subscription, setSubscription] = useState<ISubscription | null>(null);
    const user = useSelector((state: any) => state.account.user);
    const [hasShowedSuccess, setHasShowedSuccess] = useState(false);
    const location = useLocation();

    // Function kiểm tra có gói VIP nào đang active không
    const hasActiveSubscription = () => {
        return subscription?.status === 'ACTIVE' && subscription?.planName !== 'FREE';
    };

    // Điều kiện disable button
    const isButtonDisabled = (planName: string) => {
        return hasActiveSubscription() || planName === 'FREE';
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const status = searchParams.get("status");
        const messageText = searchParams.get("message");

        if (status) {  // Thêm điều kiện này
            if (status === "success" && !hasShowedSuccess) {
                message.success(messageText || "Thanh toán thành công!");
                setHasShowedSuccess(true);
            } else if (status === "failure") {
                message.error(messageText || "Thanh toán thất bại!");
            }

        }
    }, [location, hasShowedSuccess]);

    useEffect(() => {
        fetchPostLimits();
        if (user?.id) {
            fetchSubscriptionStatus();
        }
    }, [user]);

    const fetchSubscriptionStatus = async () => {
        if (!userId) return;

        try {
            const res = await callFetchSubscriptionStatus(userId);
            console.log('Subscription response:', res);
            if (res?.data) {
                setSubscription(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin gói đăng ký:", error);

        }
    };

    const fetchPostLimits = async () => {
        try {
            const res = await callFetchPostLimits();
            console.log("API Response full:", res);

            // Kiểm tra trực tiếp data và result
            if (res?.data?.result) {  // Bỏ một cấp data
                console.log("Post limits before set:", res.data.result);
                setPostLimits(res.data.result);
            } else {
                console.log("No data found in response:", res);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách gói:", error);
        }
    };

    const isPlanActive = (planName: string) => {
        if (!subscription) return false;
        return subscription.status === 'ACTIVE' &&
            subscription.planName.toUpperCase().includes(planName.toUpperCase());
    };

    const handlePurchase = async (plan: IPostLimit) => {
        setSelectedPlan(plan);
        setIsModalVisible(true);
    };

    const handleConfirmPurchase = async (paymentData: IPaymentRequest) => {
        setLoading(true);
        try {
            const res = await callCreatePayment(paymentData);
            if (res?.data?.code === "00") {
                message.success('Đơn hàng đã được tạo thành công!');
                setIsModalVisible(false);
                if (res.data.data) {
                    window.location.href = res.data.data;
                }
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const planColors: { [key: string]: string } = {
        PREMIUM: 'gold',
        BASIC: 'blue',
        DIAMOND: 'cyan',
        GOLD: 'orange',
        BRONZE: 'saddlebrown',
    };

    return (
        <div className={styles.donateContainer}>

            <div className={styles.headerSection}>
                <div className={styles.container}>
                    <div className={styles.headerFlex}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate(-1)}
                            className={styles.backButton}
                        >
                            Quay lại
                        </Button>
                        <Breadcrumb
                            items={[
                                {
                                    title: (
                                        <Link to="/">
                                            <HomeOutlined /> Trang chủ
                                        </Link>
                                    ),
                                },
                                {
                                    title: 'Nâng cấp VIP',
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.titleSection}>
                    <h1>
                        <CrownOutlined className={styles.crownIcon} />
                        Nâng cấp tài khoản VIP
                    </h1>
                    <p>
                        Nâng cấp tài khoản để đăng nhiều tin tuyển dụng hơn và tiếp cận nhiều ứng viên hơn
                    </p>
                </div>



                <Row gutter={[24, 32]} justify="center">
                    {postLimits.map((plan, index) => (
                        <Col xs={24} sm={12} md={8} key={plan.id}>
                            <Card
                                className={`${styles.planCard} ${plan.planName === 'PREMIUM' ? styles.premiumCard :
                                    plan.planName === 'BASIC' ? styles.basicPlan :
                                        plan.planName === 'DIAMOND' ? styles.diamondPlan :
                                            plan.planName === 'FREE' ? styles.freePlan : ''
                                    }`}
                                style={{ '--delay': index } as React.CSSProperties}
                                title={
                                    <div className={styles.planTitle}>
                                        <Tag color={planColors[plan.planName] || 'default'}>
                                            {plan.planName}
                                        </Tag>
                                        {isPlanActive(plan.planName) && (
                                            <Tag color="green">Đang sử dụng</Tag>
                                        )}
                                    </div>
                                }
                            >
                                <h3 className={styles.price}>
                                    {plan.price.toLocaleString('vi-VN')} VNĐ
                                </h3>
                                <div className={styles.features}>
                                    <p>
                                        <CheckCircleOutlined className={styles.checkIcon} />
                                        {plan.maxPostsPerMonth} bài đăng mỗi tháng
                                    </p>
                                    <p>
                                        <CheckCircleOutlined className={styles.checkIcon} />
                                        {plan.description}
                                    </p>
                                    {plan.planName !== 'FREE' && (
                                        <p>
                                            <CheckCircleOutlined className={styles.checkIcon} />
                                            Hỗ trợ kỹ thuật ưu tiên
                                        </p>
                                    )}
                                    {plan.planName === 'PREMIUM' && (
                                        <p>
                                            <CheckCircleOutlined className={styles.checkIcon} />
                                            Tin tuyển dụng được đề xuất ưu tiên
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="default"
                                    onClick={() => handlePurchase(plan)}
                                    className={styles.purchaseButton}
                                    disabled={isButtonDisabled(plan.planName)}
                                >
                                    {isPlanActive(plan.planName)
                                        ? 'Đang sử dụng'
                                        : plan.planName === 'FREE'
                                            ? 'Gói miễn phí'
                                            : hasActiveSubscription()
                                                ? 'Không khả dụng'
                                                : 'Mua Ngay'}
                                </Button>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Hiển thị thông tin gói đăng ký hiện tại */}
                {subscription && subscription.status === 'ACTIVE' && (
                    <div className={styles.subscriptionInfo}>
                        <div className={styles.title}>
                            <CrownOutlined style={{ marginRight: '8px' }} />
                            Gói đăng ký hiện tại
                        </div>
                        <div className={styles.expiryDate}>
                            <span className={styles.planName}>{subscription.planName}</span>
                            {(() => {
                                const { formattedDate, daysRemaining } = formatExpirationDate(subscription.timeRemainingInSeconds.toString());
                                return (
                                    <>
                                        <span className={styles.expireDate}>
                                            <strong>Ngày hết hạn:</strong> {formattedDate}
                                        </span>
                                        <span className={styles.expireDate}>
                                            <strong>Thời gian còn lại:</strong> {daysRemaining} ngày
                                        </span>

                                        {daysRemaining < 7 && (
                                            <div className={styles.expirationWarning}>
                                                <span className={styles.warningText}>
                                                    Gói của bạn sắp hết hạn. Hãy gia hạn để tiếp tục sử dụng dịch vụ
                                                </span>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>

            <VIPPaymentModal
                isVisible={isModalVisible}
                selectedPlan={selectedPlan}
                loading={loading}
                onConfirm={handleConfirmPurchase}
                onCancel={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default DonatePage;