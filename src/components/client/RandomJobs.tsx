import React from 'react';
import { Empty, Skeleton, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { convertSlug, getLocationName } from "@/config/utils";
import styles from '@/styles/client.module.scss';
import dayjs from 'dayjs';
import { IJob } from "@/types/backend";

interface RandomJobsProps {
    jobs: IJob[];
    isLoading: boolean;
}

const RandomJobs = React.memo(({ jobs = [], isLoading = false }: RandomJobsProps) => {
    const navigate = useNavigate();

    console.log("RandomJobs render with:", { jobs, isLoading }); // Debug log

    if (isLoading) {
        return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    return (
        <div>
            <h3 style={{ marginBottom: 20, fontSize: 18 }}>
                Việc làm đang tuyển dụng {Array.isArray(jobs) && jobs.length > 0 ? `(${jobs.length})` : ''}
            </h3>

            {Array.isArray(jobs) && jobs.length > 0 ? (
                jobs.map((job) => (
                    <div
                        key={job.id}
                        className={styles["random-job"]}
                        onClick={() => {
                            const slug = convertSlug(job.name);
                            navigate(`/job/${slug}?id=${job.id}`);
                        }}
                    >
                        <div className={styles["job-content"]}>
                            <div className={styles["job-title"]}>{job.name}</div>
                            {job.company && (
                                <div className={styles["company-info"]}>
                                    <img
                                        src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${job.company.logo}`}
                                        alt={job.company.name}
                                        style={{width: '48px', height: '48px', marginRight: '10px'}}
                                    />
                                    <span>{job.company.name}</span>
                                </div>
                            )}
                            <div style={{color: '#666'}}>
                                <EnvironmentOutlined style={{marginRight: 5}}/>
                                {getLocationName(job.location)}
                            </div>
                            <div style={{ color: '#666' }}>
                                <DollarOutlined style={{ marginRight: 5 }} />
                                {job.salary?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ
                            </div>
                            <div>
                                {job.skills?.map((skill, index) => (
                                    <Tag key={index} color="gold">{skill.name}</Tag>
                                ))}
                            </div>
                            <div style={{ color: '#666', fontSize: 13 }}>
                                <HistoryOutlined style={{ marginRight: 5 }} />
                                {job.updatedAt ? dayjs(job.updatedAt).locale("en").fromNow() : dayjs(job.createdAt).locale("en").fromNow()}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <Empty description="Không có việc làm nào" />
            )}
        </div>
    );
});

export default RandomJobs;