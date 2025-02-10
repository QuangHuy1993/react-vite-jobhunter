import HeaderWithoutSearch from '@/components/client/profile/header.withprofile';
import ProfileSidebar from '@/components/client/profile/ProfileSidebar';
import { callCreateSubscriber, callFetchAllSkill, callGetSubscriberSkills, callUpdateSubscriber } from '@/config/api';
import { useAppSelector } from "@/redux/hooks";
import styles from '@/styles/profile.module.scss';
import { ISubscribers } from '@/types/backend';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const { Option } = Select;

const EmailSubscription: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useAppSelector(state => state.account.user);
    // const [skills, setSkills] = useState<{ id: string; name: string; status: 'active' | 'paused' }[]>([]);
    const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [optionsSkills, setOptionsSkills] = useState<{ label: string; value: string }[]>([]);
    const [subscriber, setSubscriber] = useState<ISubscribers | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        fetchSkills();
        fetchSubscriberSkills();

        return () => clearTimeout(timer);
    }, []);

    const fetchSkills = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        try {
            const res = await callFetchAllSkill(query);
            if (res && res.data) {
                const arr = res.data.result?.map(item => ({
                    label: item.name as string,
                    value: item.id as string
                })) ?? [];
                setOptionsSkills(arr);
            }
        } catch (error) {
            console.error("Lỗi khi tải kỹ năng:", error);
        }
    };

    const fetchSubscriberSkills = async () => {
        try {
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const subscriberSkills = res.data.skills.map((skill: any) => ({
                    id: skill.id.toString(),
                    name: skill.name,
                    // status: 'active' as 'active' | 'paused'
                }));
                setSkills(subscriberSkills);
            }
        } catch (error) {
            console.error("Lỗi khi tải kỹ năng đã đăng ký:", error);
        }
    };

    const handleSkillChange = (value: string[]) => {
        setSelectedSkills(value);
    };

    const handleAddSkill = async () => {
        if (selectedSkills.length > 0) {
            if (skills.length + selectedSkills.length > 5) {
                toast.warning("Bạn chỉ có thể đăng ký tối đa 5 kỹ năng.");
                return;
            }

            // Kiểm tra xem kỹ năng đã tồn tại trong danh sách chưa
            const existingSkills = selectedSkills.filter(id => {
                const selectedSkill = optionsSkills.find(option => option.value === id);
                return skills.some(skill =>
                    skill.id === id || skill.name.toLowerCase() === selectedSkill?.label.toLowerCase()
                );
            });

            if (existingSkills.length > 0) {
                const existingSkillNames = existingSkills.map(id =>
                    optionsSkills.find(option => option.value === id)?.label
                ).join(', ');
                toast.warning(`Kỹ năng ${existingSkillNames} đã tồn tại trong danh sách của bạn.`);
                return;
            }

            const newSkills = selectedSkills.map(id => ({
                id: Number(id),
                name: optionsSkills.find(option => option.value === id)?.label || ''
            }));

            const updatedSkills = [...skills, ...newSkills];

            try {
                let res;
                if (subscriber) {
                    // Nếu đã có subscriber, sử dụng API update
                    res = await callUpdateSubscriber({
                        id: subscriber.id,
                        skills: updatedSkills.map(skill => ({ id: Number(skill.id) }))
                    });
                } else {
                    // Nếu chưa có subscriber, sử dụng API create
                    res = await callCreateSubscriber({
                        email: user.email,
                        name: user.name,
                        skills: updatedSkills.map(skill => ({ id: Number(skill.id) }))
                    });
                }

                if (res.data) {
                    setSkills(updatedSkills as { id: string; name: string }[]);
                    setSelectedSkills([]);
                    setSubscriber(res.data);
                    toast.success("Cập nhật kỹ năng thành công");
                } else {
                    toast.error("Có lỗi xảy ra khi cập nhật kỹ năng");
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật kỹ năng:", error);
                toast.error("Có lỗi xảy ra khi cập nhật kỹ năng");
            }
        }
    };


    const handleToggleSkill = async (skillId: string) => {
        // Tạm thời bỏ qua chức năng này
        toast.info("Chức năng này hiện chưa được hỗ trợ.");
    };





    const handleRemoveSkill = async (skillId: string) => {
        const result = await Swal.fire({
            title: 'Xác nhận xóa kỹ năng',
            text: "Bạn có chắc chắn muốn xóa kỹ năng này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            const updatedSkills = skills.filter(skill => skill.id !== skillId);

            try {
                const res = await callUpdateSubscriber({
                    id: subscriber?.id,
                    skills: updatedSkills.map(skill => ({ id: parseInt(skill.id) }))
                });

                if (res.data) {
                    setSkills(updatedSkills);
                    setSubscriber(res.data);
                    Swal.fire(
                        'Đã xóa!',
                        'Kỹ năng đã được xóa thành công.',
                        'success'
                    );
                } else {
                    Swal.fire(
                        'Lỗi!',
                        'Có lỗi xảy ra khi xóa kỹ năng.',
                        'error'
                    );
                }
            } catch (error) {
                console.error("Lỗi khi xóa kỹ năng:", error);
                Swal.fire(
                    'Lỗi!',
                    'Có lỗi xảy ra khi xóa kỹ năng.',
                    'error'
                );
            }
        }
    };


    return (
        <div className={styles['layout-container']}>
            <HeaderWithoutSearch
                className={styles['header-override']}
                searchTerm={''}
                setSearchTerm={() => { }}
            />
            <div className={styles['profile-container']}>
                <ProfileSidebar activePage="email-subscription" />
                <div className={styles['profile-content']}>
                    <div className={styles['email-subscription-container']}>
                        <h2>Job Hunter - thông báo về việc làm mới </h2>
                        <p>Đăng ký Job Hunter để không bỏ lỡ việc làm phù hợp với kỹ năng của bạn.</p>

                        <div className={styles['skills-section']}>
                            <h3>Kỹ năng đã đăng ký ({skills.length}/5)</h3>
                            <div className={styles['skills-input']}>
                                <Select
                                    mode="multiple"
                                    style={{ width: '70%' }}
                                    placeholder="Kỹ năng, Chức vụ"
                                    onChange={handleSkillChange}
                                    value={selectedSkills}
                                >
                                    {optionsSkills.map(option => (
                                        <Option key={option.value} value={option.value}>{option.label}</Option>
                                    ))}
                                </Select>
                                <Button onClick={handleAddSkill} type="primary" className={styles['register-button']}>
                                    Đăng ký
                                </Button>
                            </div>

                            <div className={styles['skills-list']}>
                                {skills.map(skill => (
                                    <div key={skill.id} className={styles['skill-item']}>
                                        <span>{skill.name}</span>
                                        <div className={styles['skill-actions']}>
                                            <Tooltip title="Xóa kỹ năng">
                                                <DeleteOutlined onClick={() => handleRemoveSkill(skill.id)} />
                                            </Tooltip>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailSubscription;