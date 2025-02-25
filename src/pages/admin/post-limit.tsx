import ModalPostLimit from "@/components/admin/postlimit/modal.post.limit";
import DataTable from "@/components/client/data-table";
import Access from "@/components/share/access";
import { callDeletePostLimit } from "@/config/api";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPostLimits } from "@/redux/slice/postlimitReducer";
import { IPostLimit } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from "antd";
import dayjs from 'dayjs';
import queryString from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { sfLike } from "spring-filter-query-builder";

const PostLimitPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPostLimit | null>(null);

    const tableRef = useRef<ActionType>();


    const isFetching = useAppSelector(state => state.postLimit.isFetching);
    const meta = useAppSelector(state => state.postLimit.meta);
    const postLimits = useAppSelector(state => state.postLimit.result);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log("Current postLimits:", postLimits);
        console.log("Current meta:", meta);
    }, [postLimits, meta]);
    const handleDeletePostLimit = async (id: number | undefined) => {
        if (id) {
            const res = await callDeletePostLimit(id);
            if (+res.statusCode === 200) {
                message.success('Xóa Post Limit thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = async () => {
        const query = buildQuery({ current: meta.page, pageSize: meta.pageSize }, {}, {});
        await dispatch(fetchPostLimits({ query })).unwrap();
    };

    const columns: ProColumns<IPostLimit>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>{(index + 1) + (meta.page - 1) * (meta.pageSize)}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Plan Name',
            dataIndex: 'planName',
            sorter: true,
            valueType: 'text',
            formItemProps: {
                rules: [{ required: false }]
            },
            fieldProps: {
                allowClear: true,
            }
        },
        {
            title: 'Max Posts',
            dataIndex: 'maxPostsPerMonth',
            sorter: true,
            valueType: 'digit',
            formItemProps: {
                rules: [{ required: false }]
            },
            fieldProps: {
                allowClear: true,
            },
            search: {
                transform: (value) => value ? Number(value) : undefined
            }
        },
        {
            title: 'Price (VND)',
            dataIndex: 'price',
            sorter: true,
            valueType: 'digit',
            formItemProps: {
                rules: [{ required: false }]
            },
            fieldProps: {
                allowClear: true,
            },
            search: {
                transform: (value) => value ? Number(value) : undefined
            }
        },
        {
            title: 'Description',
            dataIndex: 'description',
            hideInSearch: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record) => (
                <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record) => (
                <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
            ),
            hideInSearch: true,
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.POST_LIMITS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{ fontSize: 20, color: '#ffa500' }}
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.POST_LIMITS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa post limit"}
                            description={"Bạn có chắc chắn muốn xóa post limit này ?"}
                            onConfirm={() => handleDeletePostLimit(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        const clone = { ...params };
        if (clone.planName) q.filter = `${sfLike("planName", clone.planName)}`;
        if (clone.maxPostsPerMonth) {
            q.filter = clone.planName ?
                q.filter + " and " + `maxPostsPerMonth==${clone.maxPostsPerMonth}`
                : `maxPostsPerMonth==${clone.maxPostsPerMonth}`;
        }
        if (clone.price) {
            q.filter = clone.planName || clone.maxPostsPerMonth ? q.filter + " and " + `price==${clone.price}` : `price==${clone.price}`;
        }



        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        // Xử lý sort
        let sortBy = "";
        if (sort && sort.planName) {
            sortBy = sort.planName === 'ascend' ? "sort=planName,asc" : "sort=planName,desc";
        }
        if (sort && sort.price) {
            sortBy = sort.price === 'ascend' ? "sort=price,asc" : "sort=price,desc";
        }
        if (sort && sort.maxPostsPerMonth) {
            sortBy = sort.maxPostsPerMonth === 'ascend' ? "sort=maxPostsPerMonth,asc" : "sort=maxPostsPerMonth,desc";
        }

        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        console.log("Final query with filter:", temp);
        return temp;
    }
    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.POST_LIMITS.GET_PAGINATE}
            >
                <DataTable<IPostLimit>
                    actionRef={tableRef}
                    headerTitle="Danh sách Post Limits"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={postLimits}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchPostLimits({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={{
                        current: meta.page,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => {
                            return (<div> {range[0]}-{range[1]} trên {total} rows</div>)
                        }
                    }}
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => (
                        <Access
                            permission={ALL_PERMISSIONS.POST_LIMITS.CREATE}
                            hideChildren
                        >
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                Thêm mới
                            </Button>
                        </Access>
                    )}
                />
            </Access>
            <ModalPostLimit
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    );
}

export default PostLimitPage;