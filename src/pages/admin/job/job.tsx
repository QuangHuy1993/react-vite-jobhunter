import DataTable from "@/components/client/data-table";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {IJob, ISubscription, IUser} from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {ActionType, ProColumns, ProFormSelect, RequestData} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification,Modal } from "antd";
import { useRef,  useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { callDeleteJob,callFetchPostCountByUserId, callFetchSubscriptionStatus } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchJob, fetchJobsByHR } from "@/redux/slice/jobSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfIn } from "spring-filter-query-builder";

const JobPage = () => {
    const tableRef = useRef<ActionType>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [postCount, setPostCount] = useState<number>(0);

    const [planName, setPlanName] = useState<string>('FREE');
    const [postLimit, setPostLimit] = useState<number>(5);
    const [daysRemaining, setDaysRemaining] = useState<number>(0);

    const user = useAppSelector(state => state.account.user) as IUser;
    const isFetching = useAppSelector(state => state.job.isFetching);
    const meta = useAppSelector(state => state.job.meta);
    const jobs = useAppSelector(state => state.job.result);


    const isHR = user?.role?.name === "HR";

    useEffect(() => {
        if (isHR && user?.id) {
            checkUserSubscription(user.id.toString());
            checkPostCountByIT(user.id.toString());
        }
    }, [isHR, user?.id]);

    // Thêm hàm để xử lý postLimit dựa vào postLimitID
    const getPostLimitByID = (postLimitID: number): number => {
        switch(postLimitID) {
            case 1: return 5;  // FREE
            case 2: return 15; // BASIC
            case 3: return 30; // PREMIUM
            default: return 5;
        }
    };

    const checkUserSubscription = async (userId: string) => {
        try {
            const res = await callFetchSubscriptionStatus(userId);
            console.log("subscription response:", res?.data);

            if (res?.data) {
                const { planName: currentPlan, postLimitID, timeRemainingInSeconds, status } = res.data as ISubscription;

                if (status === 'ACTIVE') {
                    setPlanName(currentPlan);
                    const limit = getPostLimitByID(postLimitID);
                    setPostLimit(limit);

                    if (timeRemainingInSeconds) {
                        const days = Math.ceil(timeRemainingInSeconds / (24 * 60 * 60));
                        setDaysRemaining(days);
                        if (days <= 5) {
                            Modal.warning({
                                title: 'Thông báo về gói dịch vụ',
                                content: `Gói dịch vụ ${currentPlan} của bạn sẽ hết hạn trong ${days} ngày! Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.`,
                                okText: 'Đã hiểu'
                            });
                        }
                    }
                } else {
                    // Nếu subscription không active, set về FREE
                    setPlanName('FREE');
                    setPostLimit(5);
                }
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra subscription:", error);
            setPlanName('FREE');
            setPostLimit(5);
        }
    };

    const handleUpgradeVIP = () => {
        window.location.href = '/donate';
    };

    const checkPostCountByIT = async (userId: string) => {
        try {
            const res = await callFetchPostCountByUserId(userId);
            if (res?.statusCode === 200 && typeof res.data === 'number') {
                setPostCount(res.data);
                return res.data;
            }
            return 0;
        } catch (error: any) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error?.message || 'Không thể kiểm tra số lượng bài đăng'
            });
            return 0;
        }
    };


    const handleDeleteJob = async (id: string | undefined) => {
        try {
            if (id) {
                const res = await callDeleteJob(id);

                if (res?.data) {  // Chỉ cần kiểm tra có data
                    message.success('Xóa Job thành công');
                    if (isHR && user?.id) {
                        checkPostCountByIT(user.id.toString()); // Cập nhật lại số lượng post sau khi xóa
                    }
                    reloadTable();
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res?.message || 'Không thể xóa job'
                    });
                    reloadTable();
                }
            }
        } catch (error: any) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: error?.message || 'Không thể xóa job'
            });
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IJob>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.page - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Tên Job',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Công ty',
            dataIndex: ["company", "name"],
            sorter: true,
            hideInSearch: isHR, // Ẩn search công ty nếu là HR
            render: (text, record) => {
                return record.company ? record.company.name : 'N/A';
            }
        },
        {
            title: 'Mức lương',
            dataIndex: 'salary',
            sorter: true,
            render(dom, entity) {
                const str = "" + entity.salary;
                return <>{str?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</>
            },
        },
        {
            title: 'Level',
            dataIndex: 'level',
            renderFormItem: (item, props, form) => (
                <ProFormSelect
                    showSearch
                    mode="multiple"
                    allowClear
                    valueEnum={{
                        INTERN: 'INTERN',
                        FRESHER: 'FRESHER',
                        JUNIOR: 'JUNIOR',
                        MIDDLE: 'MIDDLE',
                        SENIOR: 'SENIOR',
                    }}
                    placeholder="Chọn level"
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            render(dom, entity) {
                return <>
                    <Tag color={entity.active ? "lime" : "red"} >
                        {entity.active ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            onClick={() => {
                                navigate(`/admin/job/upsert?id=${entity.id}`)
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa job"}
                            description={"Bạn có chắc chắn muốn xóa job này ?"}
                            onConfirm={() => handleDeleteJob(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        let parts = [];

        if (clone.name) parts.push(`name ~ '${clone.name}'`);
        if (clone.salary) parts.push(`salary ~ '${clone.salary}'`);
        if (clone?.level?.length) {
            parts.push(`${sfIn("level", clone.level).toString()}`);
        }

        clone.filter = parts.join(' and ');
        if (!clone.filter) delete clone.filter;

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;
        delete clone.name;
        delete clone.salary;
        delete clone.level;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        const fields = ["name", "salary", "createdAt", "updatedAt"];
        if (sort) {
            for (const field of fields) {
                if (sort[field]) {
                    sortBy = `sort=${field},${sort[field] === 'ascend' ? 'asc' : 'desc'}`;
                    break;
                }
            }
        }

        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    const fetchJobData = async (params: any, sort: any, filter: any): Promise<Partial<RequestData<IJob>>> => {
        if (isHR && user?.id) {
            // Nếu là HR, fetch jobs theo user ID
            await dispatch(fetchJobsByHR(user.id.toString()));
        } else {
            // Nếu là ADMIN hoặc role khác, fetch tất cả jobs
            const query = buildQuery(params, sort, filter);
            await dispatch(fetchJob({ query }));
        }

        return {
            data: jobs,
            success: true,
            total: meta.total,
        };
    };

    return (
        <div>
            <Access permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
                    >

                <DataTable<IJob>
                    actionRef={tableRef}
                    headerTitle={isHR ? `Danh sách Jobs của ${user?.company?.name || 'công ty'}` : "Danh sách Jobs"}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={jobs}
                    request={fetchJobData}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.page,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => (
                                <div> {range[0]}-{range[1]} trên {total} rows</div>
                            )
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access permission={ALL_PERMISSIONS.JOBS.CREATE}>
                                <Space size="middle">
                                    <Button
                                        icon={<PlusOutlined />}
                                        type="primary"
                                        onClick={async () => {
                                            if (isHR && user?.id) {
                                                const count = await checkPostCountByIT(user.id.toString());
                                                if (count >= postLimit) {
                                                    setOpenModal(true);
                                                    return;
                                                }
                                            }
                                            navigate('upsert');
                                        }}
                                    >
                                        Thêm mới
                                    </Button>
                                    {isHR && (
                                        <Tag
                                            color={postCount >= postLimit ? 'red' : 'blue'}
                                            style={{
                                                fontSize: '14px',
                                                padding: '4px 8px'
                                            }}
                                        >
                                            {postCount}/{postLimit} bài đăng {daysRemaining > 0 ? `(còn ${daysRemaining} ngày)` : ''}
                                        </Tag>
                                    )}
                                </Space>
                            </Access>
                        );
                    }}
                />
                {/* Modal thông báo giới hạn */}
                <Modal
                    title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>Thông báo giới hạn bài đăng</div>}
                    open={openModal}
                    onCancel={() => setOpenModal(false)}
                    footer={[
                        <Button key="back" onClick={() => setOpenModal(false)}>
                            Không
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleUpgradeVIP}>
                            {planName === 'PREMIUM'
                                ? 'Liên hệ hỗ trợ'
                                : planName === 'BASIC'
                                    ? 'Nâng cấp lên Premium'
                                    : 'Nâng cấp gói dịch vụ'}
                        </Button>,
                    ]}
                    centered
                    width={500}
                >
                    <div style={{ textAlign: 'center', fontSize: '16px', margin: '20px 0' }}>
                        <p>Bạn đã đạt đến giới hạn số lượng bài đăng cho phép của gói {planName}.</p>
                        {planName === 'PREMIUM' ? (
                            <p>Vui lòng liên hệ hỗ trợ để được trợ giúp.</p>
                        ) : planName === 'BASIC' ? (
                            <p>Vui lòng nâng cấp lên gói Premium để đăng nhiều hơn (giới hạn 30 bài).</p>
                        ) : (
                            <p>Vui lòng nâng cấp lên gói Basic hoặc Premium để đăng nhiều bài hơn:</p>
                        )}
                        {planName === 'FREE' && (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li>- Gói Basic: 15 bài đăng</li>
                                <li>- Gói Premium: 30 bài đăng</li>
                            </ul>
                        )}
                    </div>
                </Modal>
            </Access>
        </div>
    )
}

export default JobPage;