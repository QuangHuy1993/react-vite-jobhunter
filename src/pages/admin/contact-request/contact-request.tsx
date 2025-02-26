import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAllContactRequests, updateContactRequestStatus } from '@/redux/slice/contactRequest';
import { IContactRequest } from '@/types/backend';
import styles from './contact-request.module.scss';

const ContactRequestPage = () => {
    const dispatch = useAppDispatch();
    const [searchEmail, setSearchEmail] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const { contactRequests, isLoading } = useAppSelector((state) => state.contactRequest);
    const [filteredRequests, setFilteredRequests] = useState<IContactRequest[]>([]);

    useEffect(() => {
        dispatch(fetchAllContactRequests());
    }, [dispatch]);

    useEffect(() => {
        const filtered = contactRequests.filter(request =>
            request.email.toLowerCase().includes(searchEmail.toLowerCase())
        );
        setFilteredRequests(filtered);
    }, [contactRequests, searchEmail]);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        await dispatch(updateContactRequestStatus({ id, status: newStatus }));
        setEditingId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#f59e0b';
            case 'approved':
                return '#10b981';
            case 'rejected':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý Contact Request</h1>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                    <span className={styles.searchIcon}>🔍</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vị trí</th>
                            <th>Công ty</th>
                            <th>Địa chỉ</th>
                            <th>Website</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={11} className={styles.loading}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={11} className={styles.noData}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.fullName}</td>
                                    <td>{request.email}</td>
                                    <td>{request.phone}</td>
                                    <td>{request.position}</td>
                                    <td>{request.companyName}</td>
                                    <td>{request.companyLocation}</td>
                                    <td>
                                        <a href={request.website} target="_blank" rel="noopener noreferrer">
                                            {request.website}
                                        </a>
                                    </td>
                                    <td>
                                        {editingId === request.id ? (
                                            <select
                                                className={styles.statusSelect}
                                                value={request.status}
                                                onChange={(e) => handleStatusUpdate(request.id!, e.target.value)}
                                                style={{ backgroundColor: getStatusColor(request.status) }}
                                            >
                                                <option value="PENDING">Đang chờ</option>
                                                <option value="APPROVED">Đã duyệt</option>
                                                <option value="REJECTED">Từ chối</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={styles.statusBadge}
                                                style={{ backgroundColor: getStatusColor(request.status) }}
                                            >
                                                {request.status}
                                            </span>
                                        )}
                                    </td>
                                    <td>{formatDate(request.createdAt!)}</td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => setEditingId(request.id!)}
                                            title="Chỉnh sửa"
                                        >
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContactRequestPage;