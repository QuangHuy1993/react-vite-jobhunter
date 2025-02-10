import ApplyModal from "@/components/client/modal/apply.modal";
import RandomJobs from "@/components/client/RandomJobs";
import { callCheckSavedJob, callFetchJobById, callFetchRandomJobs, callSaveJob, callToggleSavedJob } from "@/config/api";
import { getLocationName } from "@/config/utils";
import { IJob } from "@/types/backend";
import { getUserIdFromToken } from '@/utils/jwtUtils';
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Button, Col, Divider, Empty, Row, Skeleton, Tag, Tooltip } from "antd";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import styles from 'styles/client.module.scss';

dayjs.extend(relativeTime)

const ClientJobDetailPage = (props: any) => {
    const navigate = useNavigate();
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [randomJobs, setRandomJobs] = useState<IJob[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const userId = getUserIdFromToken();

    useEffect(() => {
        const fetchRandomJobs = async () => {
            try {
                const res = await callFetchRandomJobs();
                console.log("Random jobs response:", res);
                if (res?.data) { // Kiểm tra xem res.data có tồn tại không
                    // @ts-ignore
                    setRandomJobs(res.data); // Gán mảng công việc vào state
                }
            } catch (error) {
                console.error("Error fetching random jobs:", error);
            }
        };


        const fetchJobDetail = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const res = await callFetchJobById(id);
                if (res?.data) {
                    setJobDetail(res.data);
                }
            } catch (error) {
                console.error("Error fetching job detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const checkSavedStatus = async () => {
            if (!userId || !id) return;
            try {
                const res = await callCheckSavedJob(userId, parseInt(id));
                setIsSaved(res.data === true);
                console.log("Saved status response:", res);
            } catch (error) {
                console.error("Error checking saved status:", error);
            }
        };

        // Gọi cả hai hàm fetch
        fetchJobDetail();
        fetchRandomJobs();
        checkSavedStatus();
    }, [id, userId]);

    const handleSaveJob = async () => {
        if (!userId) {
            toast.warning("Vui lòng đăng nhập để lưu công việc");
            return;
        }

        setIsLoadingSave(true);
        try {
            if (isSaved) {
                // Nếu đã lưu, sử dụng callToggleSavedJob để bỏ lưu
                const res = await callToggleSavedJob(userId, parseInt(id!));
                if (res.statusCode === 200) {
                    setIsSaved(false);
                    toast.success("Đã bỏ lưu công việc thành công");
                } else {
                    toast.error(res.message || "Không thể bỏ lưu công việc");
                }
            } else {
                // Nếu chưa lưu, sử dụng callSaveJob để lưu
                const res = await callSaveJob(userId, parseInt(id!));
                if (res.statusCode === 200 && res.data === true) {
                    setIsSaved(true);
                    toast.success("Đã lưu công việc thành công");
                } else {
                    toast.error(res.message || "Không thể lưu công việc");
                }
            }
        } catch (error) {
            console.error("Lỗi khi xử lý công việc:", error);
            toast.error("Đã xảy ra lỗi khi xử lý công việc");
        } finally {
            setIsLoadingSave(false);
        }
    };
    if (isLoading) {
        return (
            <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
                <Row gutter={[20, 20]}>
                    <Col span={24} md={16}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </Col>
                    <Col span={24} md={8}>
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </Col>
                </Row>
            </div>
        );
    }

    if (!jobDetail) {
        return (
            <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
                <Empty description="Không tìm thấy công việc" />
            </div>
        );
    }

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            <Row gutter={[20, 20]}>
                <Col span={24} md={16}>
                    <div className={styles["header"]}>
                        {jobDetail.name}
                    </div>
                    <div className={styles["apply-container"]}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={styles["btn-apply"]}
                        >
                            Apply now
                        </button>
                        <Tooltip title={isSaved ? "Unsave this job" : "Save this job"}>
                            <Button
                                icon={isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                onClick={handleSaveJob}
                                loading={isLoadingSave}
                                className={styles["favorite-icon"]}
                            />
                        </Tooltip>
                    </div>
                    <Divider />
                    <div className={styles["skills"]}>
                        {jobDetail?.skills?.map((item, index) => (
                            <Tag key={`${index}-key`} color="gold">{item.name}</Tag>
                        ))}
                    </div>
                    <div className={styles["salary"]}>
                        <DollarOutlined />
                        <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                    </div>
                    <div className={styles["location"]}>
                        <EnvironmentOutlined style={{ color: '#58aaab' }} />
                        &nbsp;{getLocationName(jobDetail.location)}
                    </div>
                    <div>
                        <HistoryOutlined />
                        {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}
                    </div>
                    <Divider />
                    {parse(jobDetail.description)}
                </Col>

                <Col span={24} md={8}>
                    {jobDetail?.company && (
                        <>
                            <div className={styles["company"]}>
                                <div>
                                    <img
                                        width={"200px"}
                                        alt="example"
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                                    />
                                </div>
                                <div style={{ marginTop: 10, fontSize: 16, fontWeight: 500 }}>
                                    {jobDetail.company?.name}
                                </div>
                            </div>
                            <Divider />
                        </>
                    )}
                    <RandomJobs jobs={randomJobs} isLoading={isLoading} />
                </Col>
            </Row>

            <ApplyModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                jobDetail={jobDetail}
            />
        </div>
    );
};

export default ClientJobDetailPage;