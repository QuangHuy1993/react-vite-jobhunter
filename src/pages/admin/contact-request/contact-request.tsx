import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAllContactRequests, updateContactRequestStatus } from '@/redux/slice/contactRequest';
import { IContactRequest } from '@/types/backend';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './contact-request.module.scss';

const ContactRequestPage = () => {
    const dispatch = useAppDispatch();
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<IContactRequest | null>(null);
    const [tempStatus, setTempStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { contactRequests, isLoading } = useAppSelector((state) => state.contactRequest);
    const [filteredRequests, setFilteredRequests] = useState<IContactRequest[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{
        field: string;
        direction: 'asc' | 'desc';
    }>({ field: 'id', direction: 'desc' });
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const itemsPerPage = 10;

    // Thêm hàm để tải lại dữ liệu
    const reloadData = () => {
        setIsFiltering(true);
        dispatch(fetchAllContactRequests())
            .finally(() => {
                setTimeout(() => {
                    setIsFiltering(false);
                }, 500); // Hiển thị loading ít nhất 0.5s để người dùng thấy
            });
    };

    useEffect(() => {
        reloadData();
    }, [dispatch]);

    useEffect(() => {
        let filtered = [...contactRequests].sort((a, b) => {
            if (sortConfig.field === 'createdAt') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
                    : new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
            }
            if (sortConfig.field === 'id') {
                return sortConfig.direction === 'asc'
                    ? (a.id || 0) - (b.id || 0)
                    : (b.id || 0) - (a.id || 0);
            }
            return 0;
        });

        filtered = filtered.filter(request =>
            request.email.toLowerCase().includes(searchEmail.toLowerCase())
        );

        if (selectedStatuses.length > 0) {
            filtered = filtered.filter(request =>
                selectedStatuses.includes(request.status)
            );
        }

        setFilteredRequests(filtered);
    }, [contactRequests, searchEmail, sortConfig, selectedStatuses]);

    const handleSort = (field: string) => {
        setSortConfig(current => ({
            field,
            direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleStatusFilterChange = (status: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            }
            return [...prev, status];
        });
    };

    const applyStatusFilter = async () => {
        setIsFiltering(true);
        setShowStatusFilter(false);
        // Giả lập loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsFiltering(false);
    };

    const handleStatusUpdate = async () => {
        if (!selectedRequest || !tempStatus) return;
        try {
            setIsUpdating(true); // Bắt đầu hiển thị trạng thái loading

            await dispatch(updateContactRequestStatus({ id: selectedRequest.id!, status: tempStatus }));

            toast.success('Cập nhật trạng thái thành công!');
            setShowModal(false);
            setSelectedRequest(null);

            // Tải lại dữ liệu sau khi cập nhật thành công
            await reloadData();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái!');
        } finally {
            setIsUpdating(false); // Kết thúc trạng thái loading
        }
    };

    const truncateUrl = (url: string, maxLength = 20) => {
        if (!url) return '';

        try {
            // Xử lý URL bằng cách xóa protocol và www nếu có
            let cleanUrl = url
                .replace(/^(https?:\/\/)?(www\.)?/, '')
                .replace(/\/$/, '');

            // Cắt ngắn URL nếu quá dài
            if (cleanUrl.length > maxLength) {
                return cleanUrl.substring(0, maxLength) + '...';
            }

            return cleanUrl;
        } catch (e) {
            // Nếu có lỗi khi xử lý URL, trả về URL gốc đã cắt ngắn
            return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
        }
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

    const getStatusText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'APPROVED':
                return 'Đã duyệt';
            case 'REJECTED':
                return 'Từ chối';
            default:
                return status;
        }
    };

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const paginatedRequests = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Quản lý Contact Request</h1>
                <div className={styles.filters}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                    <div className={styles.statusFilter}>
                        <button
                            className={styles.filterButton}
                            onClick={() => setShowStatusFilter(!showStatusFilter)}
                        >
                            Lọc theo trạng thái ▼
                        </button>
                        {showStatusFilter && (
                            <div className={styles.filterDropdown}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedStatuses.includes('PENDING')}
                                        onChange={() => handleStatusFilterChange('PENDING')}
                                    />
                                    Chờ xác nhận
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedStatuses.includes('APPROVED')}
                                        onChange={() => handleStatusFilterChange('APPROVED')}
                                    />
                                    Đã duyệt
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedStatuses.includes('REJECTED')}
                                        onChange={() => handleStatusFilterChange('REJECTED')}
                                    />
                                    Từ chối
                                </label>
                                <button onClick={applyStatusFilter}>Áp dụng</button>
                            </div>
                        )}
                    </div>
                    {/* Thêm nút tải lại dữ liệu */}
                    <button
                        className={styles.filterButton}
                        onClick={reloadData}
                        disabled={isFiltering}
                    >
                        🔄 Tải lại
                    </button>
                </div>
            </div>

            {(isFiltering || isLoading || isUpdating) && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner}>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>
                                ID {sortConfig.field === 'id' && (
                                    <span className={styles.sortIcon}>
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Vị trí</th>
                            <th>Công ty</th>
                            <th>Địa chỉ</th>
                            <th>Website</th>
                            <th>Trạng thái</th>
                            <th>Gửi Gmail</th>
                            <th>Ngày gửi</th>
                            <th onClick={() => handleSort('createdAt')}>
                                Ngày tạo {sortConfig.field === 'createdAt' && (
                                    <span className={styles.sortIcon}>
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading || isFiltering ? (
                            <tr>
                                <td colSpan={11} className={styles.loading}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : paginatedRequests.length === 0 ? (
                            <tr>
                                <td colSpan={11} className={styles.noData}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            paginatedRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.fullName}</td>
                                    <td>{request.email}</td>
                                    <td>{request.phone}</td>
                                    <td>{request.position}</td>
                                    <td>{request.companyName}</td>
                                    <td>{request.companyLocation}</td>
                                    <td className={styles.websiteColumn}>
                                        {request.website ? (
                                            <a
                                                href={request.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.websiteLink}
                                                title={request.website}
                                            >
                                                {truncateUrl(request.website)}
                                            </a>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            className={styles.statusBadge}
                                            style={{ backgroundColor: getStatusColor(request.status) }}
                                        >
                                            {getStatusText(request.status)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={request.isEmailSent ? styles.emailSent : styles.emailNotSent}>
                                            {request.isEmailSent ? '✅ Đã gửi' : '❌ Chưa gửi'}
                                        </span>
                                    </td>
                                    <td>
                                        {request.emailSentAt ? formatDate(request.emailSentAt) : 'N/A'}
                                    </td>
                                    <td>{formatDate(request.createdAt!)}</td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                setSelectedRequest(request);
                                                setTempStatus(request.status); // Đặt giá trị mặc định cho status
                                                setShowModal(true);
                                            }}
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

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        ⟪
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        ⟨
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={currentPage === i + 1 ? styles.active : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        ⟩
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                        ⟫
                    </button>
                </div>
            )}

            {showModal && selectedRequest && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h2>Cập nhật Contact Request</h2>
                        <div className={styles.form}>
                            <div className={styles.row}>
                                <label>Họ và tên:</label>
                                <input type="text" value={selectedRequest.fullName} disabled />
                            </div>
                            <div className={styles.row}>
                                <label>Email:</label>
                                <input type="email" value={selectedRequest.email} disabled />
                            </div>
                            <div className={styles.row}>
                                <label>Số điện thoại:</label>
                                <input type="text" value={selectedRequest.phone} disabled />
                            </div>
                            <div className={styles.row}>
                                <label>Trạng thái:</label>
                                <select
                                    value={tempStatus || selectedRequest.status}
                                    onChange={(e) => setTempStatus(e.target.value)}
                                    disabled={isUpdating}
                                >
                                    <option value="PENDING">Chờ xác nhận</option>
                                    <option value="APPROVED">Đã duyệt</option>
                                    <option value="REJECTED">Từ chối</option>
                                </select>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.cancel}
                                    onClick={() => setShowModal(false)}
                                    disabled={isUpdating}
                                >
                                    Hủy
                                </button>
                                <button
                                    className={styles.save}
                                    onClick={handleStatusUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactRequestPage;