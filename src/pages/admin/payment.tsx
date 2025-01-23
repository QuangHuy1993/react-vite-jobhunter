import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IPayment } from "@/types/backend";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, notification, Popconfirm, Space } from "antd";
import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { callDeletePostLimit } from "config/api";
import { fetchPayments } from "@/redux/slice/paymentSlide";
import { Input, Button, Row, Col } from "antd";
import styles from '@/styles/payment.module.scss';
import PaymentStatusModal from "components/admin/payment/module.payment";


const PaymentPage = () => {
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IPayment | null>(null);
    const tableRef = useRef<ActionType>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dispatch = useAppDispatch();
    const payments = useAppSelector((state) => state.payment.result);
    const isFetching = useAppSelector((state) => state.payment.isFetching);
    const [searchValue, setSearchValue] = useState("");
    const [searchParams, setSearchParams] = useState({});



    const handleDeletePostLimit = async (id: number | undefined) => {
        if (id) {
            const res = await callDeletePostLimit(id);
            if (+res.statusCode === 200) {
                message.success('Xóa Post Limit thành công');
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleUpdateClick = (payment: IPayment) => {
        setDataInit(payment);
        setIsModalVisible(true);
    };

    const handleUpdate = () => {
        dispatch(fetchPayments(searchParams));
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setDataInit(null);
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'PAYMENT_SUCCEED':
                return styles['success'];
            case 'PAYMENT_PENDING':
                return styles['pending'];
            case 'PAYMENT_FAILED':
                return styles['failed'];
            default:
                return '';
        }
    };

    useEffect(() => {
        dispatch(fetchPayments(searchParams));
    }, [dispatch, searchParams]);

    const handleSearchSubmit = () => {
        setSearchParams({
            paymentRef: searchValue // Đổi từ string sang object
        });
    };

    const columns: ProColumns<IPayment>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
            hideInSearch: true,
            render: (_, record) => (
                <a onClick={() => {
                    setOpenViewDetail(true);
                    setDataInit(record);
                }} className={styles['id-link']}>
                    {record.id}
                </a>
            )
        },
        {
            title: 'Mã giao dịch',
            dataIndex: 'paymentRef',
            hideInSearch: true,
        },
        {
            title: 'Số tiền',
            dataIndex: 'totalPrice',
            hideInSearch: true,
            render: (price) => (
                <span className={styles['amount-cell']}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as number)}
                </span>
            )
        },
        {
            title: 'Nội dung',
            dataIndex: 'transferContent',
            hideInSearch: true,
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            hideInSearch: true,
            filters: [
                { text: 'VNPAY', value: 'VNPAY' },
                { text: 'MOMO', value: 'MOMO' },
                { text: 'ZALOPAY', value: 'ZALOPAY' },
            ],
            onFilter: (value, record) => record.paymentMethod === value,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'paymentStatus',
            filters: [
                { text: 'PAYMENT_SUCCEED', value: 'PAYMENT_SUCCEED' },
                { text: 'PAYMENT_PENDING', value: 'PAYMENT_PENDING' },
                { text: 'PAYMENT_FAILED', value: 'PAYMENT_FAILED' },
            ],
            hideInSearch: true,
            onFilter: (value, record) => record.paymentStatus === value,
            render: (status) => (
                <span className={`${styles['status-cell']} ${styles[getStatusStyle(status as string)]}`}>
                    {status}
                </span>
            )
        },
        {
            title: 'Người thanh toán',
            dataIndex: ['user', 'name'],
            hideInSearch: true,
        },
        {
            title: "User_ID",
            dataIndex: ['user', 'id'],
            hideInSearch: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            hideInSearch: true,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (date) => dayjs(date as string).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            hideInSearch: true,
            render: (date) => dayjs(date as string).format('DD-MM-YYYY HH:mm:ss')
        },
        {
            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.PAYMENTS.UPDATE} hideChildren>
                        <EditOutlined
                            className={`${styles['action-button']} ${styles['edit']}`}
                            onClick={() => {
                                setDataInit(entity);
                                setIsModalVisible(true);
                            }}
                        />
                    </Access>
                    <Access permission={ALL_PERMISSIONS.PAYMENTS.DELETE} hideChildren>
                        <Popconfirm
                            placement="leftTop"
                            title="Xác nhận xóa payment"
                            description="Bạn có chắc chắn muốn xóa payment này?"
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined className={`${styles['action-button']} ${styles['delete']}`} />
                        </Popconfirm>
                    </Access>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles['payment-container']}>
            <Access permission={ALL_PERMISSIONS.PAYMENTS?.GET_PAGINATE}>
                <div className={styles['search-section']}>
                    <div className={styles['search-section']}>
                        <Row justify="center">
                            <Col xs={24} sm={16} md={12}>
                                <Space size={12} style={{width: '100%'}}>
                                    <span className="search-label">Mã giao dịch:</span>
                                    <Input
                                        placeholder="Nhập mã giao dịch"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    <Button type="primary" onClick={handleSearchSubmit}>
                                        Tìm kiếm
                                    </Button>
                                    <Button onClick={() => {
                                        setSearchValue("");
                                        setSearchParams({});
                                    }}>
                                        Làm mới
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className={styles['table-container']}>
                    <DataTable<IPayment>
                        actionRef={tableRef}
                        headerTitle="Danh sách giao dịch"
                        rowKey="id"
                        columns={columns}
                        dataSource={payments}
                        scroll={{x: true}}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} rows`
                        }}
                        rowSelection={false}
                        search={false}
                    />
                </div>
            </Access>
            <PaymentStatusModal
                visible={isModalVisible}
                onClose={handleModalClose}
                payment={dataInit}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default PaymentPage;