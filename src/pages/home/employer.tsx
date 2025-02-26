import Footer from '@/components/client/footer.client';
import { callFetchCompany, callSubmitContactForm } from '@/config/api';
import { useLanguage } from '@/contexts/language-context';
import { RootState } from '@/redux/store';
import styles from '@/styles/employer.module.scss';
import { ICompany } from '@/types/backend';
import { Button, Col, Row, Tooltip, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    const [showTooltip, setShowTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [servicesVisible, setServicesVisible] = useState(false);
    const [brandingVisible, setBrandingVisible] = useState(false);
    const [ctaVisible, setCtaVisible] = useState(false);
    const [companiesVisible, setCompaniesVisible] = useState(false);
    const [contactFormVisible, setContactFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { currentLang, t, changeLanguage } = useLanguage();
    const [formSubmitted, setFormSubmitted] = useState(false);
    // Thêm state để theo dõi trạng thái validate
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        position: '',
        email: '',
        phone: '',
        companyName: '',
        companyLocation: '',
        termsAgreed: ''
    });

    const scrollToContactForm = () => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const [formData, setFormData] = useState({
        fullName: '',
        position: '',
        email: '',
        phone: '',
        companyName: '',
        companyLocation: '',
        website: '',
        termsAgreed: false
    });

    //function để xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Function kiểm tra form có hợp lệ không
    const isFormValid = () => {
        return (
            formData.fullName.trim() !== '' &&
            formData.position.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.companyName.trim() !== '' &&
            formData.companyLocation !== '' &&
            formData.termsAgreed === true
        );
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

    // Function xử lý submit form
    const handleSubmitContact = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);

        // Kiểm tra và thiết lập lỗi cho từng trường
        const errors = {
            fullName: formData.fullName.trim() === '' ? 'Vui lòng nhập họ tên đầy đủ' : '',
            position: formData.position.trim() === '' ? 'Vui lòng nhập chức vụ của bạn' : '',
            email: formData.email.trim() === '' ? 'Vui lòng nhập email' : '',
            phone: formData.phone.trim() === '' ? 'Vui lòng nhập số điện thoại' : '',
            companyName: formData.companyName.trim() === '' ? 'Vui lòng nhập tên công ty' : '',
            companyLocation: formData.companyLocation === '' ? 'Vui lòng chọn địa điểm công ty' : '',
            termsAgreed: formData.termsAgreed === false ? 'Vui lòng đồng ý với điều khoản dịch vụ' : ''
        };

        setFormErrors(errors);

        if (!isFormValid()) {
            toast.error('Vui lòng nhập đầy đủ thông tin và đồng ý với điều khoản dịch vụ');
            return;
        }

        setIsSubmitting(true);

        const toastId = toast.loading('Đang gửi thông tin, vui lòng chờ trong giây lát...', {
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false
        });

        try {
            const response = await callSubmitContactForm(formData);

            if (response.data) {
                toast.update(toastId, {
                    render: 'Thông tin của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ sớm nhất có thể.',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    closeButton: true
                });

                // Reset form
                setFormData({
                    fullName: '',
                    position: '',
                    email: '',
                    phone: '',
                    companyName: '',
                    companyLocation: '',
                    website: '',
                    termsAgreed: false
                });

                // Reset form errors và trạng thái đã submit
                setFormErrors({
                    fullName: '',
                    position: '',
                    email: '',
                    phone: '',
                    companyName: '',
                    companyLocation: '',
                    termsAgreed: ''
                });
                setFormSubmitted(false);

            } else {
                toast.update(toastId, {
                    render: 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!',
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    closeButton: true
                });
            }

        } catch (error) {
            console.error('Lỗi khi gửi thông tin:', error);
            toast.update(toastId, {
                render: 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau!',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                closeButton: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.employerContainer}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src="/src/assets/Logooo.png" alt="Jobhunter Logo" />
                    <span>{t('employerPage')}</span>
                </div>
                <div className={styles.auth}>
                    <Button type="link" onClick={() => navigate('/login')}>{t('login')}</Button>
                    <div className={styles.langSelector}>
                        <button
                            className={currentLang === 'EN' ? styles.activeLang : ''}
                            onClick={() => {
                                console.log("Current language before change:", currentLang);
                                localStorage.setItem('preferredLanguage', 'EN');
                                console.log("Setting language to EN");
                                window.location.reload();
                            }}
                            style={{
                                background: 'none',
                                padding: '5px 10px',
                                margin: '0 5px',
                                cursor: 'pointer',
                                font: 'inherit',
                                fontWeight: currentLang === 'EN' ? 'bold' : 'normal',
                                border: currentLang === 'EN' ? '1px solid #ccc' : 'none',
                                zIndex: 1000,
                                position: 'relative'
                            }}
                        >
                            EN
                        </button> | <button
                            className={currentLang === 'VI' ? styles.activeLang : ''}
                            onClick={() => {
                                console.log("Current language before change:", currentLang);
                                localStorage.setItem('preferredLanguage', 'VI');
                                console.log("Setting language to VI");
                                window.location.reload();
                            }}
                            style={{
                                background: 'none',
                                padding: '5px 10px',
                                margin: '0 5px',
                                cursor: 'pointer',
                                font: 'inherit',
                                fontWeight: currentLang === 'VI' ? 'bold' : 'normal',
                                border: currentLang === 'VI' ? '1px solid #ccc' : 'none',
                                zIndex: 1000,
                                position: 'relative'
                            }}
                        >
                            VI
                        </button>
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
                                <Title level={1}>{t('heroTitle')}</Title>
                                <Paragraph className={styles.heroDescription}>
                                    {t('heroDescription')}
                                </Paragraph>
                                <Button type="primary" size="large" className={styles.contactButton} onClick={scrollToContactForm}>
                                    {t('contactNow')}
                                </Button>
                                <div className={styles.loginPrompt}>
                                    <span>{t('haveAccount')} </span>
                                    <a href="/login">{t('login')}</a>
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
                        <h2>{t('differenceTitle')}</h2>
                        <p>{t('differenceDesc')}</p>
                    </div>

                    <Row gutter={[24, 24]} className={styles.statsCards}>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/handshake-svgrepo-com.svg" alt="Công ty" />
                                </div>
                                <div className={styles.statsNumber}>10,000+</div>
                                <div className={styles.statsDescription}>{t('stat1')}</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/mail-send-svgrepo-com.svg" alt="Hồ sơ" />
                                </div>
                                <div className={styles.statsNumber}>1,500,000+</div>
                                <div className={styles.statsDescription}>{t('stat2')}</div>
                            </div>
                        </Col>
                        <Col xs={24} md={8}>
                            <div className={styles.statsCard}>
                                <div className={styles.iconWrapper}>
                                    <img src="/src/assets/team-svgrepo-com.svg" alt="Ứng viên" />
                                </div>
                                <div className={styles.statsNumber}>300,000+</div>
                                <div className={styles.statsDescription}>{t('stat3')}</div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>

            <div ref={servicesRef}
                className={`${styles.servicesSection} ${servicesVisible ? styles.animated : ''}`}>
                <div className={styles.container}>
                    <h2 className={styles.servicesTitle}>{t('servicesTitle')}</h2>

                    <div className={styles.servicesContent}>
                        <div className={`${styles.serviceInfo} ${servicesVisible ? styles.fadeInLeft : ''}`}>
                            <div className={styles.serviceCard}>
                                <h3>{t('postJob')}</h3>
                                <p>{t('postJobDesc')}</p>

                                <div className={styles.serviceFeatures}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/leader.png" alt="Users icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>{t('feature1')}</h4>
                                        </div>
                                    </div>

                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/wifi.png" alt="Search icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>{t('feature2')}</h4>
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
                                <h3>{t('branding')}</h3>
                                <p>{t('brandingDesc')}</p>

                                <div className={styles.serviceFeatures}>
                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/bar-chart.png" alt="Chart icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>{t('topEmployer')}</h4>
                                            <p>{t('topEmployerDesc')}</p>
                                        </div>
                                    </div>

                                    <div className={styles.featureItem}>
                                        <div className={styles.featureIcon}>
                                            <img src="/src/assets/megaphone.png" alt="Megaphone icon" />
                                        </div>
                                        <div className={styles.featureText}>
                                            <h4>{t('featuredEmployer')}</h4>
                                            <p>{t('featuredEmployerDesc')}</p>
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
                        <p className={styles.ctaText}>{t('experienceService')}</p>
                        <a href="#contact" className={styles.ctaButton}>{t('contactNow')}</a>
                    </div>
                </div>
            </div>

            <div ref={companiesRef}
                className={`${styles.topCompaniesSection} ${companiesVisible ? styles.animated : ''}`}>
                <div className={styles.container}>
                    <h2 className={styles.companiesTitle}>{t('topCompanies')}</h2>
                    <p className={styles.companiesDescription}>
                        {t('companiesDesc')}
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
                    <h2 className={styles.contactTitle}>{t('findTalent')}</h2>
                    <p className={styles.contactDescription}>{t('contactDesc')}</p>
                    <div className={styles.contactFormContainer}>
                        <div className={styles.formContent}>
                            <form className={styles.contactForm} onSubmit={handleSubmitContact} noValidate>
                                <div className={styles.formGroup}>
                                    <h3 className={styles.formGroupTitle}>{t('personalInfo')}</h3>
                                    <div className={styles.formRow}>
                                        <div className={styles.formField}>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder={t('fullName')}
                                                className={formSubmitted && formErrors.fullName ? styles.inputError : ''}
                                                required
                                            />
                                            {formSubmitted && formErrors.fullName && (
                                                <div className={styles.errorText}>{formErrors.fullName}</div>
                                            )}
                                        </div>
                                        <div className={styles.formField}>
                                            <input
                                                type="text"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                placeholder={t('position')}
                                                className={formSubmitted && formErrors.position ? styles.inputError : ''}
                                                required
                                            />
                                            {formSubmitted && formErrors.position && (
                                                <div className={styles.errorText}>{formErrors.position}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formField}>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder={t('email')}
                                                className={formSubmitted && formErrors.email ? styles.inputError : ''}
                                                required
                                            />
                                            {formSubmitted && formErrors.email && (
                                                <div className={styles.errorText}>{formErrors.email}</div>
                                            )}
                                        </div>
                                        <div className={styles.formField}>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder={t('phone')}
                                                className={formSubmitted && formErrors.phone ? styles.inputError : ''}
                                                required
                                            />
                                            {formSubmitted && formErrors.phone && (
                                                <div className={styles.errorText}>{formErrors.phone}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <h3 className={styles.formGroupTitle}>{t('companyInfo')}</h3>
                                    <div className={styles.formField}>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            placeholder={t('companyName')}
                                            className={formSubmitted && formErrors.companyName ? styles.inputError : ''}
                                            required
                                        />
                                        {formSubmitted && formErrors.companyName && (
                                            <div className={styles.errorText}>{formErrors.companyName}</div>
                                        )}
                                    </div>
                                    <div className={styles.formField}>
                                        <select
                                            name="companyLocation"
                                            value={formData.companyLocation}
                                            onChange={handleInputChange}
                                            className={formSubmitted && formErrors.companyLocation ? styles.inputError : ''}
                                            required
                                        >
                                            <option value="" disabled>{t('companyLocation')}</option>
                                            <option value="hcm">Hồ Chí Minh</option>
                                            <option value="hn">Hà Nội</option>
                                            <option value="dn">Đà Nẵng</option>
                                            <option value="other">Khác</option>
                                        </select>
                                        {formSubmitted && formErrors.companyLocation && (
                                            <div className={styles.errorText}>{formErrors.companyLocation}</div>
                                        )}
                                    </div>
                                    <div className={styles.formField}>
                                        <input
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder={t('website')}
                                        />
                                        <small className={styles.fieldNote}>{t('websiteNote')}</small>
                                    </div>

                                    <div className={`${styles.checkboxField} ${formSubmitted && formErrors.termsAgreed ? styles.checkboxError : ''}`}>
                                        <input
                                            type="checkbox"
                                            id="termsAgreement"
                                            name="termsAgreed"
                                            checked={formData.termsAgreed}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <label htmlFor="termsAgreement">
                                            {t('termsAgreement')} <a href="#" className={styles.linkText}>{t('terms')}</a> và <a href="#" className={styles.linkText}>{t('privacyPolicy')}</a> {t('privacyInfo')}
                                        </label>
                                    </div>
                                    {formSubmitted && formErrors.termsAgreed && (
                                        <div className={styles.errorText}>{formErrors.termsAgreed}</div>
                                    )}
                                </div>

                                <div className={styles.formActions}>
                                    <div className={styles.loginPrompt}>
                                        <span>{t('haveCustomerAccount')} </span>
                                        <a href="/login" className={styles.loginLink}>{t('login')}</a>
                                    </div>
                                    <Tooltip
                                        title={!isFormValid() ? t('tooltipMessage') : ''}
                                        placement="top"
                                        color="#ff4d4f"
                                        // Chỉ hiển thị tooltip khi form không hợp lệ và đang hover
                                        trigger={!isFormValid() && formSubmitted ? ['hover'] : []}
                                    >
                                        <div style={{ display: 'inline-block' }}>
                                            <button
                                                type="submit"
                                                className={`${styles.submitButton} ${!isFormValid() && formSubmitted ? styles.disabledButton : ''}`}
                                                disabled={isSubmitting} // Chỉ disable khi đang submit
                                            >
                                                {isSubmitting ? t('sending') : t('contactMe')}
                                            </button>
                                        </div>
                                    </Tooltip>
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
                                        <h4>{t('hotlineHCM')}</h4>
                                        <p>0787 143 983</p>
                                    </div>
                                </div>

                                <div className={styles.contactInfoItem}>
                                    <div className={styles.contactIcon}>
                                        <img src="/src/assets/hotline.png" alt="Phone" />
                                    </div>
                                    <div className={styles.contactInfoContent}>
                                        <h4>{t('hotlineHN')}</h4>
                                        <p>0362 600 321</p>
                                    </div>
                                </div>

                                <div className={styles.contactInfoItem}>
                                    <div className={styles.contactIcon}>
                                        <img src="/src/assets/clock.svg" alt="Clock" />
                                    </div>
                                    <div className={styles.contactInfoContent}>
                                        <h4>{t('workingHours')}</h4>
                                        <p>{t('workingTime')}</p>
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