import React from 'react';
import logoImage from '../../assets/Logooo.png';
import bgImage from '../../assets/redblack.jpg';
import styles from '../../styles/client.module.scss';
const Footer = () => {
    return (
        <footer className="text-center text-lg-start bg-dark mt-5"
                // style={{background: styles.gradientLight, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
                style={{backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
        >
            {/* Section: Links */}
            <section className="text-white" style={{ paddingTop: '10px' }}>
                <div className="container text-center text-md-start mt-5">
                    <div className="row mt-3">
                        {/* Jobhunter Info */}
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <div className="mb-4">
                                <img
                                    src={logoImage}
                                    alt="Jobhunter Logo"
                                    className="img-fluid"
                                    onClick={() => window.location.href = '/'}
                                    style={{width: '500px', height: 'auto', cursor: 'pointer'}}
                                />
                            </div>
                        </div>

                        {/* Về Jobhunter */}
                        <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Về Jobhunter
                            </h6>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">Trang Chủ</a>
                            </p>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">Về Jobhunter.com</a>
                            </p>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">Dịch vụ gợi ý ứng viên</a>
                            </p>
                            <p>
                                <a href="https://www.facebook.com/huy.750729/" className="text-white text-decoration-none">Liên Hệ</a>
                            </p>
                        </div>

                        {/* Chương trình */}
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Ngôn ngữ nổi bật
                            </h6>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">Java Spring</a>
                            </p>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">ReactJS</a>
                            </p>
                            <p>
                                <a href="#!" className="text-white text-decoration-none">PHP</a>
                            </p>
                        </div>

                        {/* Liên hệ */}
                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">Liên hệ để đăng tin tuyển dụng tại:</h6>
                            <p>
                                <i className="fas fa-phone me-3"></i>
                                HCM: (+84) 787 143 983
                            </p>
                            <p>
                                <i className="fas fa-phone me-3"></i>
                                HN: (+84) 362 600 321
                            </p>
                            <p>
                                <i className="fas fa-envelope me-3"></i>
                                quanghuydao17@gmail.com
                            </p>
                            <p>
                                <i className="fas fa-paper-plane me-3"></i>
                                Gửi thông tin liên hệ
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Copyright */}
            <div className="text-center p-4 text-white" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
                © 2024 Copyright:
                <a className="text-white fw-bold text-decoration-none" href="#"> Jobhunter™</a>
            </div>
        </footer>
    );
};

export default Footer;