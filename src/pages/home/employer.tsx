import Footer from '@/components/client/footer.client';
import { callFetchCompany } from '@/config/api';
import { RootState } from '@/redux/store';
import styles from '@/styles/employer.module.scss';
import { ICompany } from '@/types/backend';
import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const { Title, Paragraph } = Typography;
/**
 * Trang dành cho nhà tuyển dụng
 * Hiển thị thông tin và quy trình đăng ký trở thành nhà tuyển dụng
 */
const EmployerPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.account.user);
    const servicesRef = useRef<HTMLDivElement>(null);
    const brandingRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const companiesRef = useRef<HTMLDivElement>(null);
    const contactFormRef = useRef<HTMLDivElement>(null);

    const [scrollY, setScrollY] = useState(0);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [servicesVisible, setServicesVisible] = useState(false);
    const [brandingVisible, setBrandingVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const [companiesVisible, setCompaniesVisible] = useState(false);
    const [contactFormVisible, setContactFormVisible] = useState(false);

    const scrollToContactForm = () => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    useEffect(() => {
        // Tạo observer để theo dõi khi các element xuất hiện trong viewport
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.2 // Khi element hiển thị 20% trở lên
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                // Kiểm tra element nào đang được quan sát và cập nhật state tương ứng
                if (entry.target === servicesRef.current) {
                    setServicesVisible(entry.isIntersecting);
                } else if (entry.target === brandingRef.current) {
                    setBrandingVisible(entry.isIntersecting);
                } else if (entry.target === ctaRef.current) {
                    setCtaVisible(entry.isIntersecting);
                } else if (entry.target === companiesRef.current) {
                    setCompaniesVisible(entry.isIntersecting);
                } else if (entry.target === contactFormRef.current) {
                    setContactFormVisible(entry.isIntersecting);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Đăng ký các elements để quan sát
        if (servicesRef.current) observer.observe(servicesRef.current);
        if (brandingRef.current) observer.observe(brandingRef.current);
        if (ctaRef.current) observer.observe(ctaRef.current);
        if (companiesRef.current) observer.observe(companiesRef.current);
        if (contactFormRef.current) observer.observe(contactFormRef.current);

        // Cleanup function
        return () => {
            if (servicesRef.current) observer.unobserve(servicesRef.current);
            if (brandingRef.current) observer.unobserve(brandingRef.current);
            if (ctaRef.current) observer.unobserve(ctaRef.current);
            if (companiesRef.current) observer.unobserve(companiesRef.current);
            if (contactFormRef.current) observer.unobserve(contactFormRef.current);
        };
    }, []);

    useEffect(() => {
        const getCompanies = async () => {
            try {
                setIsLoading(true);
                // Có thể thay đổi query để lấy số lượng công ty phù hợp, ví dụ: page=1&pageSize=12
                const res = await callFetchCompany('page=1&pageSize=12');
                if (res?.data?.result) {
                    setCompanies(res.data.result);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getCompanies();
    }, []);

    return (
        <div className={styles.employerContainer}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src="/src/assets/Logooo.png" alt="Jobhunter Logo" />
                    <span>Nhà Tuyển Dụng</span>
                </div>
                <div className={styles.auth}>
                    <Button type="link" onClick={() => navigate('/login')}>Đăng Nhập</Button>
                    <div className={styles.langSelector}>
                        <span>EN</span> | <span>VI</span>
                    </div>
                </div>
            </div>

            <div className={styles.heroSection}>
                <div
                    className={styles.heroBackground}
                    style={{
                        transform: `translateY(${scrollY * 0.4}px)`
                    }}
                ></div>

                <div className={styles.container}>
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} md={12}>
                            <div className={styles.heroContent}>
                                <Title level={1}>Tuyển dụng Nhân tài IT tại Việt Nam cùng Jobhunter</Title>
                                <Paragraph className={styles.heroDescription}>
                                    Với hiểu biết sâu sắc về lĩnh vực IT và các kỹ năng chuyên môn, chúng tôi có thể giúp bạn tiếp cận và tuyển dụng những ứng viên IT tốt nhất.
                                </Paragraph>
                                <Button type="primary" size="large" className={styles.contactButton} onClick={scrollToContactForm}>
                                    Liên hệ ngay
                                </Button>
                                <div className={styles.loginPrompt}>
                                    <span>Đã có tài khoản Khách hàng? </span>
                                    <a href="/login">Đăng nhập</a>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div className={styles.heroGraphicContainer}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src="/src/assets/Hero.png"
                                        alt="Recruiter Dashboard Preview"
                                        className={styles.dashboardImage}
                                    />
                                    <div className={styles.imageBadge}>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className={styles.statsSection}>
                <div className={styles.container}>
                    <div className={styles.statsHeader}>
                        <h2>Điều gì tạo nên sự khác biệt ở Jobhunter?</h2>
                        <p>Jobhunter là trang tuyển dụng và cơ sở dữ liệu hàng đầu về các chuyên gia IT tại Việt Nam.</p>
                    </div>

                    <Row gutter={[24, 24]} className={styles.statsCards}>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/handshake-svgrepo-com.svg" alt="Công ty" />
                                </div>
                                <div className={styles.statsNumber}>10,000+</div>
                                <div className={styles.statsDescription}>Công ty và Doanh nghiệp IT</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/mail-send-svgrepo-com.svg" alt="Hồ sơ" />
                                </div>
                                <div className={styles.statsNumber}>1,500,000+</div>
                                <div className={styles.statsDescription}>Hồ sơ đã gửi đến Nhà tuyển dụng</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/team-svgrepo-com.svg" alt="Ứng viên" />
                                </div>
                                <div className={styles.statsNumber}>300,000+</div>
                                <div className={styles.statsDescription}>Hồ sơ Ứng viên kinh nghiệm cao</div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div ref={servicesRef}
                className={`${styles.servicesSection} ${servicesVisible ? styles.animated : ''}`}>
                <div className={styles.container}>
                    <h2 className={styles.servicesTitle}>Dịch vụ chất lượng cao dành cho Nhà tuyển dụng IT</h2>

                    <div className={styles.servicesContent}>
                        <div className={`${styles.serviceInfo} ${servicesVisible ? styles.fadeInLeft : ''}`}>
                            <div className={styles.serviceCard}>
                                <h3>Đăng tin tuyển dụng</h3>
                                <p>Đăng tuyển vị trí công việc IT, dễ dàng quản lý hồ sơ ứng viên với giao diện trực quan, đội ngũ hỗ trợ, và công cụ mạnh mẽ từ Jobhunter</p>

                                <div className={styles.serviceFeatures}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/leader.png" alt="Users icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>Gia tăng cơ hội để tiếp cận ứng viên IT chất lượng từ Jobhunter</h4>
                                        </div>
                                    </div>

                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/wifi.png" alt="Search icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>Thu hút ứng viên phù hợp với yêu cầu về kỹ năng IT</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`${styles.serviceImage} ${servicesVisible ? styles.fadeInRight : ''}`}>
                            <img src="/src/assets/hero1.webp" alt="Dashboard Preview" />
                        </div>
                    </div>
                </div>

                {/* Phần Thương hiệu tuyển dụng mới */}
                <div ref={brandingRef}
                    className={`${styles.container} ${brandingVisible ? styles.animated : ''}`}
                    style={{ marginTop: '30px' }}>


                    <div className={styles.servicesContent}>
                        <div className={`${styles.serviceImage_2} ${brandingVisible ? styles.fadeInLeft : ''}`}>
                            <img src="/src/assets/hero2.webp" alt="Employer Branding Preview" />
                        </div>

                        <div className={`${styles.serviceInfo} ${brandingVisible ? styles.fadeInRight : ''}`}>
                            <div className={styles.serviceCard}>
                                <h3>Nâng cao thương hiệu nhà tuyển dụng</h3>
                                <p>Nâng cao nhận diện thương hiệu của Nhà tuyển dụng, tiếp cận các chuyên gia IT qua các điểm chạm đặc biệt, và kết nối với các ứng viên IT hàng đầu tại Việt Nam</p>

                                <div className={styles.serviceFeatures}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/bar-chart.png" alt="Chart icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>Nhà tuyển dụng hàng đầu</h4>
                                            <p>Xuất hiện với vị trí công ty IT nổi bật hàng đầu tại Việt Nam</p>
                                        </div>
                                    </div>

                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/megaphone.png" alt="Megaphone icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>Nhà tuyển dụng nổi bật</h4>
                                            <p>Tăng cường xây dựng thương hiệu nhà tuyển dụng đến với những nhân tài IT hàng đầu</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div ref={ctaRef}
                    className={`${styles.ctaSection} ${ctaVisible ? styles.fadeIn : ''}`}>
                    <div className={`${styles.container} ${ctaVisible ? styles.scaleUp : ''}`}>
                        <p className={styles.ctaText}>Trải nghiệm dịch vụ của Jobhunter ngay hôm nay</p>
                        <a href="#contact" className={styles.ctaButton}>Liên hệ ngay</a>
                    </div>
                </div>
            </div>

            <div ref={companiesRef}
                className={`${styles.topCompaniesSection} ${companiesVisible ? styles.animated : ''}`}>
                <div className={styles.container}>
                    <h2 className={styles.companiesTitle}>Top Công ty hàng đầu tại Jobhunter</h2>
                    <p className={styles.companiesDescription}>
                        Nhà tuyển dụng và đối tác của chúng tôi bao gồm các công ty IT hàng đầu, và các công ty khởi nghiệp sáng tạo
                    </p>

                    <div className={styles.companyLogosContainer}>
                        {isLoading ? (
                            <div className={styles.loadingCompanies}>
                                <img src="/src/assets/loading.gif" alt="Loading companies..." />
                            </div>
                        ) : (
                            <div className={styles.companyLogosGrid}>
                                {companies.map((company, index) => (
                                    <div key={company.id}
                                        className={`${styles.companyLogo} ${companiesVisible ? styles[`fadeIn-${index % 5}`] : ''}`}
                                        style={{
                                            animationDelay: `${(index % 12) * 0.1}s`
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${company.logo}`}
                                            alt={`${company.name} Logo`}
                                            onError={(e) => {
                                                // Fallback nếu ảnh lỗi
                                                (e.target as HTMLImageElement).src = "/src/assets/default-company.png";
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div ref={contactFormRef}
                id="contact"
                className={`${styles.contactFormSection} ${contactFormVisible ? styles.animated : ''}`}>
                <div className={styles.container}>
                    <h2 className={styles.contactTitle}>Tìm kiếm Nhân tài IT phù hợp</h2>
                    <p className={styles.contactDescription}>Để lại thông tin liên hệ để nhận tư vấn từ Phòng Chăm sóc Khách hàng của Jobhunter.</p>
                    <div className={styles.contactFormContainer}>
                        <div className={styles.formContent}>
                            <form className={styles.contactForm}>
                                <div className={styles.formGroup}>
                                    <h3 className={styles.formGroupTitle}>Thông tin Quý khách</h3>
                                    <div className={styles.formRow}>
                                        <div className={styles.formField}>
                                            <input type="text" placeholder="Họ và tên *" required />
                                        </div>
                                        <div className={styles.formField}>
                                            <input type="text" placeholder="Chức vụ *" required />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formField}>
                                            <input type="email" placeholder="Email làm việc *" required />
                                        </div>
                                        <div className={styles.formField}>
                                            <input type="tel" placeholder="Số điện thoại *" required />
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <h3 className={styles.formGroupTitle}>Thông tin công ty</h3>
                                    <div className={styles.formField}>
                                        <input type="text" placeholder="Tên công ty *" required />
                                    </div>
                                    <div className={styles.formField}>
                                        <select required>
                                            <option value="" disabled selected>Địa chỉ công ty *</option>
                                            <option value="hcm">Hồ Chí Minh</option>
                                            <option value="hn">Hà Nội</option>
                                            <option value="dn">Đà Nẵng</option>
                                        </select>
                                    </div>
                                    <div className={styles.formField}>
                                        <input type="url" placeholder="Địa chỉ website" />
                                        <small className={styles.fieldNote}>URL bao gồm đầy đủ giao thức (https), ví dụ: https://Jobhunter.com</small>
                                    </div>

                                    <div className={styles.checkboxField}>
                                        <input type="checkbox" id="termsAgreement" required />
                                        <label htmlFor="termsAgreement">
                                            Tôi đã đọc và đồng ý với các <a href="#" className={styles.linkText}>Điều khoản dịch vụ</a> và <a href="#" className={styles.linkText}>Chính sách quyền riêng tư</a> của Jobhunter liên quan đến thông tin riêng tư của tôi.
                                        </label>
                                    </div>
                                </div>

                                <div className={styles.formActions}>
                                    <div className={styles.loginPrompt}>
                                        <span>Đã có tài khoản Khách hàng? </span>
                                        <a href="/login" className={styles.loginLink}>Đăng nhập</a>
                                    </div>
                                    <button type="submit" className={styles.submitButton}>Liên hệ tôi</button>
                                </div>
                            </form>
                        </div>

                        <div className={styles.contactSidebar}>
                            <div className={styles.contactInfoCard}>
                                <div className={styles.contactInfoItem}>
                                    <div className={styles.contactIcon}>
                                        <img src="/src/assets/hotline.png" alt="Phone" />
                                    </div>
                                    <div className={styles.contactInfoContent}>
                                        <h4>Hotline Hồ Chí Minh</h4>
                                        <p>0977 460 519</p>
                                    </div>
                                </div>

                                <div className={styles.contactInfoItem}>
                                    <div className={styles.contactIcon}>
                                        <img src="/src/assets/hotline.png" alt="Phone" />
                                    </div>
                                    <div className={styles.contactInfoContent}>
                                        <h4>Hotline Hà Nội</h4>
                                        <p>0983 131 531</p>
                                    </div>
                                </div>

                                <div className={styles.contactInfoItem}>
                                    <div className={styles.contactIcon}>
                                        <img src="/src/assets/clock.svg" alt="Clock" />
                                    </div>
                                    <div className={styles.contactInfoContent}>
                                        <h4>Thời gian làm việc</h4>
                                        <p>Thứ 2 - Thứ 6 | 8:30 - 17:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EmployerPage;