import { callFetchSavedJobsByUserId, callToggleSavedJob } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { IJobSaves } from '@/types/backend';
import { EnvironmentOutlined, HeartFilled } from '@ant-design/icons';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WorkIcon from '@mui/icons-material/Work';
import { Button, Card, Grid, MenuItem, Pagination, Select, SelectChangeEvent } from '@mui/material';
import { Tag, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import styles from './cardSaveJob.module.scss';
const CardSaveJob: React.FC = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState<IJobSaves[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const itemsPerPage = 4;
    const user = useAppSelector(state => state.account.user);

    const calculateDaysDifference = (startDate: string) => {
        const start = new Date(startDate);
        const now = new Date();
        const difference = now.getTime() - start.getTime();
        const days = Math.ceil(difference / (1000 * 3600 * 24));
        return days;
    };

    const formatTimeAgo = (days: number) => {
        if (days < 1) return 'Hôm nay';
        if (days === 1) return 'Hôm qua';
        if (days < 7) return `${days} ngày trước`;
        if (days < 30) {
            const weeks = Math.floor(days / 7);
            return `${weeks} tuần trước`;
        }
        if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} tháng trước`;
        }
        const years = Math.floor(days / 365);
        return `${years} năm trước`;
    };

    const sortJobs = (jobs: IJobSaves[]) => {
        const sortedJobs = [...jobs];
        if (sortBy === 'newest') {
            return sortedJobs.sort((a, b) =>
                new Date(b.job.startDate).getTime() - new Date(a.job.startDate).getTime()
            );
        } else if (sortBy === 'expiringSoon') {
            return sortedJobs.sort((a, b) =>
                new Date(a.job.endDate).getTime() - new Date(b.job.endDate).getTime()
            );
        }
        return sortedJobs;
    };

    const handleUnsaveJob = async (jobId: number) => {
        const result = await Swal.fire({
            title: 'Xác nhận bỏ lưu',
            text: "Bạn có chắc chắn muốn bỏ lưu công việc này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#F44336',
            cancelButtonText: 'Hủy',
            confirmButtonText: 'Đồng ý',
            background: '#f8f9fa',
            backdrop: `
            rgba(0,0,0,0.4)
            url("../../../assets/nyan-cat.gif")
            left top
            no-repeat
    `,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        if (result.isConfirmed && user?.id) {
            try {
                const res = await callToggleSavedJob(Number(user.id), jobId);
                if (res.statusCode === 200) {
                    // Remove the job from the savedJobs state
                    setSavedJobs(prevJobs => prevJobs.filter(job => job.job.id !== jobId));

                    toast.success("Đã bỏ lưu công việc thành công", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    // Add Undo option
                    toast.info(
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Bạn có muốn hoàn tác?</span>
                            <button
                                onClick={() => handleUndoUnsave(jobId)}
                                style={{
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Hoàn tác
                            </button>
                        </div>,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        }
                    );
                } else {
                    toast.error(res.message || "Không thể bỏ lưu công việc");
                }
            } catch (error) {
                console.error("Error unsaving job:", error);
                toast.error("Đã xảy ra lỗi khi bỏ lưu công việc");
            }
        }
    };

    const handleUndoUnsave = async (jobId: number) => {
        if (user?.id) {
            try {
                const res = await callToggleSavedJob(Number(user.id), jobId);
                if (res.statusCode === 200) {
                    const updatedSavedJobs = await callFetchSavedJobsByUserId(user.id);
                    if (updatedSavedJobs.data) {
                        setSavedJobs(updatedSavedJobs.data);
                        toast.success("Đã hoàn tác bỏ lưu công việc");
                    } else {
                        toast.error("Không thể cập nhật danh sách công việc đã lưu");
                    }
                } else {
                    toast.error(res.message || "Không thể hoàn tác bỏ lưu công việc");
                }
            } catch (error) {
                console.error("Error undoing unsave job:", error);
                toast.error("Đã xảy ra lỗi khi hoàn tác bỏ lưu công việc");
            }
        }
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

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (user?.id) {
                try {
                    const response = await callFetchSavedJobsByUserId(user.id);
                    if (response.data) {
                        setSavedJobs(response.data);
                        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy danh sách công việc đã lưu:", error);
                }
            }
        };

        fetchSavedJobs();
    }, [user]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortBy(event.target.value as string);
    };

    const sortedJobs = sortJobs(savedJobs);
    const paginatedJobs = sortedJobs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Việc làm đã lưu</h1>
                <div className={styles.sortContainer}>
                    <span>Sắp xếp theo:</span>
                    <Select
                        value={sortBy}
                        onChange={handleSortChange}
                        className={styles.sortSelect}
                    >
                        <MenuItem value="newest">Việc làm mới nhất</MenuItem>
                        <MenuItem value="expiringSoon">Ngày hết hạn gần nhất</MenuItem>
                    </Select>
                </div>
            </div>

            <Grid container spacing={3} className={styles.cardGrid}>
                {paginatedJobs.map((job, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Card className={styles.jobCard}>
                            <div className={styles.postDate}>
                                {formatTimeAgo(calculateDaysDifference(job.job.startDate))}
                            </div>
                            <div className={styles.jobHeader}>
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company.logo}`}
                                    alt={job.company.name}
                                    className={styles.companyLogo}
                                />
                                <div className={styles.jobInfo}>
                                    <h3>{job.job.name}</h3>
                                    <p>{job.company.name}</p>
                                </div>
                            </div>
                            <div className={styles.jobContent}>
                                <div className={styles.jobDetails}>
                                    <p><EnvironmentOutlined /> {job.job.location}</p>
                                    <p><AttachMoneyIcon className={styles.icon} /> {job.job.salary.toLocaleString()} VND</p>
                                    <p><WorkIcon className={styles.icon} /> {job.job.level}</p>
                                </div>
                                <div className={styles.jobSkills}>
                                    {job.skills.slice(0, 4).map((skill, idx) => (
                                        <Tag key={idx}>{skill.name}</Tag>
                                    ))}
                                    {job.skills.length > 4 && <Tag>+{job.skills.length - 4}</Tag>}
                                </div>
                            </div>
                            <div className={styles.jobActions}>
                                <Button variant="contained" color="primary" fullWidth className={styles.applyButton}
                                    onClick={(e) => handleJobClick(e, job.job.id, job.job.name)}
                                >
                                    Ứng tuyển
                                </Button>
                                <Tooltip title="Đã lưu">
                                    <Button variant="outlined" className={styles.heartButton} onClick={() => handleUnsaveJob(job.job.id)}>
                                        <HeartFilled style={{ color: 'red' }} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default CardSaveJob;