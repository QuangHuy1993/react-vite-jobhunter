import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { IJob } from "@/types/backend";
import { callFetchJobById, callFetchRandomJobs } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Empty, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
import RandomJobs from "@/components/client/RandomJobs";
dayjs.extend(relativeTime)

const ClientJobDetailPage = (props: any) => {
    const navigate = useNavigate();
    const [jobDetail, setJobDetail] = useState<IJob | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [randomJobs, setRandomJobs] = useState<IJob[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const fetchRandomJobs = async () => {
            try {
                const res = await callFetchRandomJobs();
                console.log("Random jobs response:", res);
                if (res?.data) { // Kiểm tra xem res.data có tồn tại không
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

        // Gọi cả hai hàm fetch
        fetchJobDetail();
        fetchRandomJobs();
    }, [id]);

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
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={styles["btn-apply"]}
                        >Apply Now</button>
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