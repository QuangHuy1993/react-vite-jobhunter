import { callChangePassword, callDeleteProfileImage, callUpdateUser, callUploadProfileImage } from '@/config/api';
import { useAppSelector } from "@/redux/hooks";
import styles from '@/styles/profile.module.scss';
import { IUser } from '@/types/backend';
import {
    AccountCircle,
    Cake,
    Delete,
    Edit,
    Email,
    Link as LinkIcon,
    LocationOn,
    Lock,
    Person,
    Phone,
    VpnKey,
    Wc,
    Work
} from '@mui/icons-material';
import { Avatar, Button, Card, Empty, Form, Input, Modal, Select, Tabs, Tag, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const { Option } = Select;
const { TabPane } = Tabs;


// Thêm regex để kiểm tra password format
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

const validatePassword = (_: any, value: string): Promise<void> => {
    if (!value) {
        return Promise.reject(new Error('Vui lòng nhập mật khẩu!'));
    }
    if (!passwordRegex.test(value)) {
        return Promise.reject(new Error('Mật khẩu phải có chữ cái đầu viết hoa, bao gồm số và chữ, ít nhất 6 ký tự!'));
    }
    return Promise.resolve();
};

interface ProfileEditModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onFinish: (values: any) => void;
    onPasswordChange: (values: any) => void;
    initialValues: any;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    isVisible,
    onCancel,
    onFinish,
    onPasswordChange,
    initialValues,
}) => {
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAppSelector(state => state.account.user);




    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const fileSizeInMB = file.size / (1024 * 1024);

            if (fileSizeInMB > 5) {
                toast.error('Kích thước ảnh không được vượt quá 5MB');
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setSelectedFile(file);
                const previewURL = URL.createObjectURL(file);
                setPreviewImage(previewURL);
                toast.success('Ảnh đã được chọn thành công. Vui lòng bấm Lưu để cập nhật');
            }
        }
    };

    const handleEditButtonClick = () => {
        fileInputRef.current?.click();
    };

    const getFormValues = (values: any): IUser => {
        return {
            id: user.id,
            name: values.name,
            phoneNumber: values.phoneNumber,
            age: Number(values.age),
            gender: values.gender,
            address: values.address,
            email: values.email,
            urlProfile: values.urlProfile,
            urlAvatar: user.urlAvatar ?? '',
        };
    };
    const handleFormSubmit = async () => {
        try {
            // Lấy giá trị từ form
            const values = await form.validateFields();
            console.log("Form values:", values);

            // Upload ảnh nếu có
            if (selectedFile) {
                try {
                    const uploadResponse = await callUploadProfileImage(user.id, selectedFile);
                    if (!uploadResponse.data) {
                        toast.error('Upload ảnh thất bại');
                        return;
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    toast.error('Có lỗi xảy ra khi upload ảnh');
                    return;
                }
            }

            // Chuẩn bị dữ liệu user để update
            const userData = getFormValues(values);

            // Update thông tin user
            const response = await callUpdateUser(userData);
            console.log("User data to update:", userData);

            if (response.data) {
                toast.success('Cập nhật thông tin thành công', {
                    autoClose: 1000,
                    onClose: () => {
                        window.location.reload();
                    }
                });
                onFinish(response.data);
            } else {
                toast.error('Cập nhật thông tin thất bại');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Có lỗi xảy ra khi cập nhật thông tin');
            }
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteImage = async () => {
        if (!user?.id) return;

        const result = await Swal.fire({
            title: 'Xác nhận xóa ảnh',
            text: "Bạn có chắc chắn muốn xóa ảnh đại diện?",
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

        if (result.isConfirmed) {
            try {
                await callDeleteProfileImage(user.id);
                setSelectedFile(null);
                setPreviewImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                form.setFieldsValue({ urlAvatar: '' });
                initialValues.urlAvatar = '';
                toast.success('Xóa ảnh đại diện thành công.Vui lòng bấm Lưu để cập nhật', {
                    autoClose: 1000
                });
            } catch (error) {
                console.error('Error deleting profile image:', error);
                toast.error('Có lỗi xảy ra khi xóa ảnh đại diện');
            }
        }
    };
    const handlePasswordChange = async (values: any) => {
        const result = await Swal.fire({
            title: 'Xác nhận đổi mật khẩu',
            text: "Bạn có chắc chắn muốn đổi mật khẩu?",
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

        if (result.isConfirmed) {
            try {

                const response = await callChangePassword(user.id, {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                });
                if (response.data) {
                    toast.success('Đổi mật khẩu thành công', { autoClose: 1000 });
                    passwordForm.resetFields();
                } else {
                    toast.error('Đổi mật khẩu thất bại');
                }
            } catch (error) {
                console.error('Error changing password:', error);
                toast.error('Có lỗi xảy ra khi đổi mật khẩu');
            }
        }
    };

    return (
        <Modal
            title="Cập nhật thông tin người dùng"
            open={isVisible}
            onCancel={onCancel}
            footer={null}
            width={700}
            className={styles.profileEditModal}
        >
            <Tabs defaultActiveKey="1" className={styles.tabs}>
                <TabPane
                    tab={
                        <span>
                            <AccountCircle className={styles.tabIcon} />
                            Thông tin cá nhân
                        </span>
                    }
                    key="1"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={initialValues}
                    >
                        <div className={styles.avatarContainer}>
                            {previewImage || initialValues.urlAvatar ? (
                                <img
                                    src={previewImage || initialValues.urlAvatar}
                                    alt="Avatar"
                                    className={styles.avatar}
                                />
                            ) : (
                                <Avatar size={100} className={styles.avatar}>
                                    {initialValues.name?.substring(0, 2)?.toUpperCase()}
                                </Avatar>
                            )}
                            <div className={styles.avatarActions}>
                                <Tooltip title="Thay đổi ảnh đại diện">
                                    <Button
                                        icon={<Edit />}
                                        className={styles.editButton}
                                        onClick={handleEditButtonClick}
                                    />
                                </Tooltip>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                />
                                <Tooltip title="Xóa ảnh đại diện">
                                    <Button
                                        icon={<Delete />}
                                        className={styles.deleteButton}
                                        onClick={() => {
                                            handleDeleteImage();
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>

                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        >
                            <Input prefix={<Person />} placeholder="Họ và Tên" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập địa chỉ email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}

                        >
                            <Input
                                prefix={<Email />}
                                placeholder="Địa chỉ email"
                                disabled
                                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                        >
                            <Input prefix={<Phone />} placeholder="Số điện thoại" />
                        </Form.Item>
                        <Form.Item
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                        >
                            <Input prefix={<Cake />} placeholder="Tuổi" type="number" />
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            <div className={styles.genderSelectWrapper}>
                                <Wc className={styles.genderIcon} />
                                <Select
                                    placeholder="Giới tính"
                                    className={styles.genderSelect}
                                    value={form.getFieldValue('gender')}
                                    onChange={(value) => form.setFieldsValue({ gender: value })}
                                    defaultValue={initialValues.gender}
                                >
                                    <Option value="MALE">Nam</Option>
                                    <Option value="FEMALE">Nữ</Option>
                                    <Option value="OTHER">Khác</Option>
                                </Select>
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input prefix={<LocationOn />} placeholder="Địa chỉ" />
                        </Form.Item>
                        <Form.Item name="urlProfile">
                            <Input prefix={<LinkIcon />} placeholder="Link cá nhân" />
                        </Form.Item>
                        <Form.Item className={styles.buttonGroup}>
                            <Button onClick={onCancel} className={styles.cancelButton}>
                                Huỷ
                            </Button>
                            <Button onClick={handleFormSubmit} type="primary" htmlType="submit" className={styles.submitButton}>
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <VpnKey className={styles.tabIcon} />
                            Đổi mật khẩu
                        </span>
                    }
                    key="2"
                >
                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordChange}
                        className={styles.passwordForm}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                        >
                            <Input.Password
                                prefix={<Lock className={styles.inputIcon} />}
                                placeholder="Nhập mật khẩu hiện tại"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                { validator: validatePassword }
                            ]}
                        >
                            <Input.Password
                                prefix={<Lock className={styles.inputIcon} />}
                                placeholder="Nhập mật khẩu mới"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<Lock className={styles.inputIcon} />}
                                placeholder="Xác nhận mật khẩu mới"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item className={styles.buttonGroup}>
                            <Button onClick={onCancel} className={styles.cancelButton} size="large">
                                Huỷ
                            </Button>
                            <Button type="primary" htmlType="submit" className={styles.submitButton} size="large">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane
                    tab={
                        <span>
                            <Work className={styles.tabIcon} />
                            Vai trò & Công ty
                        </span>
                    }
                    key="3"
                >
                    <div className={styles.roleAndCompanyInfo}>
                        <Card title="Vai trò hiện tại" className={styles.infoCard}>
                            {initialValues.role ? (
                                <Tag color="blue" className={styles.roleTag}>
                                    {initialValues.role.name}
                                </Tag>
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className={styles.emptyText}>
                                            Bạn không có vai trò nào 😢
                                        </span>

                                    }
                                />
                            )}
                        </Card>

                        <Card title="Công ty hiện tại" className={styles.infoCard}>
                            {initialValues.company ? (
                                <div className={styles.companyInfo}>
                                    <div className={styles.companyDetails}>
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${initialValues.company?.logo}`}
                                            alt="Company Logo"
                                            className={styles.companyLogo}
                                        />
                                        <h4 className={styles.companyName}>{initialValues.company.name}</h4>
                                    </div>
                                </div>
                            ) : (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className={styles.emptyText}>
                                            Bạn chưa liên kết với công ty nào 😢
                                        </span>
                                    }
                                />
                            )}
                        </Card>
                    </div>
                </TabPane>
            </Tabs>
        </Modal>

    );
};

export default ProfileEditModal;