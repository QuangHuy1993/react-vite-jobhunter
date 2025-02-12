import icon from '@/assets/box.svg';
import { callFetchResumeDetails } from '@/config/api';
import styles from '@/styles/profile.module.scss';
import { ResumeDetailDTO } from '@/types/backend';
import { ClockCircleOutlined, DollarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Pagination } from '@mui/material';
import { Card, Select, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderWithoutSearch from './header.withprofile';
import ProfileSidebar from './ProfileSidebar';
import CardSaveJob from './savejob/cardSaveJob';
const { Option } = Select;
const MyJobs: React.FC = () => {
    const [activeTab, setActiveTab] = useState('applied');
    const [sortBy, setSortBy] = useState('latest');
    const [resumeDetails, setResumeDetails] = useState<ResumeDetailDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 4;


    useEffect(() => {
        fetchResumeDetails();
    }, []);

    useEffect(() => {
        // Calculate total pages whenever resumeDetails changes
        setTotalPages(Math.ceil(resumeDetails.length / itemsPerPage));
    }, [resumeDetails]);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };



    const handleJobClick = (event: React.MouseEvent, jobId: number, jobName: string) => {
        event.preventDefault();
        const slug = jobName
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-') 
            .replace(/-+/g, '-') 
            .trim(); 
        navigate(`/job/${slug}?id=${jobId}`);
    };

    const fetchResumeDetails = async () => {
        setLoading(true);
        try {
            const response = await callFetchResumeDetails();
            if (response.data) {
                setResumeDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching resume details:", error);
        } finally {
            setLoading(false);
        }
    };

    const sortedResumeDetails = [...resumeDetails].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    const getCurrentPageItems = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedResumeDetails.slice(startIndex, endIndex);
    };

    const renderJobCards = () => {
        if (loading && activeTab === 'applied') {
            return <Spin size="large" />;
        }

        if (activeTab === 'applied') {
            if (sortedResumeDetails.length === 0) {
                return (
                    <div className={styles['empty-state']}>
                        <img src={icon} alt="Empty box icon" />
                        <p>Bạn có 0 Việc làm đã ứng tuyển</p>
                    </div>
                );
            }

            return (
                <>
                    <div className={styles['job-grid']}>
                        {getCurrentPageItems().map((job, index) => (
                            <Card key={index} className={styles['job-card']}>
                                <div className={styles['job-header']}>
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.companyLogo}`}
                                        alt={job.companyName}
                                        className={styles['company-logo']}
                                    />
                                    <div className={styles['job-title']} onClick={(e) => handleJobClick(e, job.jobId, job.jobName)}>
                                        {job.jobName}
                                    </div>
                                </div>
                                <div className={styles['job-details']}>
                                    <div><EnvironmentOutlined /> {job.location}</div>
                                    <div><DollarOutlined /> {job.salary.toLocaleString()} VND</div>
                                    <div><ClockCircleOutlined /> {new Date(job.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div className={styles['job-skills']}>
                                    {job.skillNames.map((skill, idx) => (
                                        <Tag key={idx} color="blue">{skill}</Tag>
                                    ))}
                                </div>
                                <div className={styles['job-status']}>
                                    Status: <span className={styles[`status-${job.status.toLowerCase()}`]}>{job.status}</span>
                                </div>
                                <a
                                    href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${job.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['view-cv-link']}
                                >
                                    Xem CV đã gửi
                                </a>
                            </Card>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className={styles['pagination-container']}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handleChangePage}
                                color="primary"
                                size="large"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '2rem',
                                    '& .MuiPaginationItem-root': {
                                        color: '#1976d2',
                                        '&.Mui-selected': {
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#1565c0',
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </>
            );
        } else {
            return <CardSaveJob />;
        }
    };

    return (
        <div className={styles['layout-container']}>
            <HeaderWithoutSearch
                className={styles['header-override']}
                searchTerm={''}
                setSearchTerm={() => { }}
            />
            <div className={styles['profile-container']}>
                <ProfileSidebar activePage='my-jobs' />
                <div className={styles['profile-content']}>
                    <h1 className={styles['content-title']}>Việc làm của tôi</h1>
                    <div className={styles['job-tabs']}>
                        <button
                            className={`${styles['tab']} ${activeTab === 'applied' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('applied')}
                        >
                            Đã ứng tuyển
                        </button>
                        <button
                            className={`${styles['tab']} ${activeTab === 'saved' ? styles['active'] : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            Đã lưu
                        </button>
                    </div>
                    <div className={styles['job-list-container']}>
                        <div className={styles['job-list-header']}>
                            <h2>
                                {activeTab === 'applied'
                                    ? `Việc làm đã ứng tuyển (${sortedResumeDetails.length})`
                                    : ''
                                }
                            </h2>
                            {activeTab === 'applied' && (
                                <div className={styles['sort-container']}>
                                    <span>Sắp xếp theo:</span>
                                    <Select
                                        defaultValue="latest"
                                        style={{ width: 200 }}
                                        onChange={(value) => setSortBy(value)}
                                    >
                                        <Option value="latest">Việc làm mới nhất</Option>
                                        <Option value="oldest">Ngày hết hạn gần nhất</Option>
                                    </Select>
                                </div>
                            )}
                        </div>
                        <div className={styles['job-list']}>
                            {renderJobCards()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyJobs;