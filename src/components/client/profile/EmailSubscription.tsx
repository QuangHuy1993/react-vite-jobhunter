import HeaderWithoutSearch from '@/components/client/profile/header.withprofile';
import ProfileSidebar from '@/components/client/profile/ProfileSidebar';
import styles from '@/styles/profile.module.scss';
import { DeleteOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import React, { useState } from 'react';

const { Option } = Select;

const EmailSubscription: React.FC = () => {
    const [skills, setSkills] = useState<{ name: string; status: 'active' | 'paused' }[]>([
        { name: 'java - reactjs - javascript', status: 'active' }
    ]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const handleSkillChange = (value: string[]) => {
        setSelectedSkills(value);
    };

    const handleAddSkill = () => {
        if (selectedSkills.length > 0 && skills.length < 5) {
            const newSkill: { name: string; status: 'active' | 'paused' } = {
                name: selectedSkills.join(' - '),
                status: 'active'
            };
            setSkills([...skills, newSkill]);
            setSelectedSkills([]);
        }
    };
    const handleToggleSkill = (skillName: string) => {
        setSkills(skills.map(skill =>
            skill.name === skillName
                ? { ...skill, status: skill.status === 'active' ? 'paused' : 'active' }
                : skill
        ));
    };

    const handleRemoveSkill = (skillName: string) => {
        setSkills(skills.filter(skill => skill.name !== skillName));
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
                        <h2>Job Robot - thông báo về việc làm mới và đánh giá công ty</h2>
                        <p>Đăng ký Job Robot để không bỏ lỡ việc làm phù hợp với kỹ năng của bạn.</p>

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
                                    <Option value="java">Java</Option>
                                    <Option value="reactjs">ReactJS</Option>
                                    <Option value="javascript">JavaScript</Option>
                                </Select>
                                <Button onClick={handleAddSkill} type="primary" className={styles['register-button']}>
                                    Đăng ký
                                </Button>
                            </div>
                            <div className={styles['skills-list']}>
                                {skills.map(skill => (
                                    <div key={skill.name} className={styles['skill-item']}>
                                        <span>{skill.name}</span>
                                        <p className={skill.status === 'active' ? styles['active'] : styles['paused']}>
                                            {skill.status === 'active' ? 'Đã đăng ký' : 'Tạm dừng nhận Email'}
                                        </p>
                                        <div className={styles['skill-actions']}>
                                            <Tooltip title={skill.status === 'active' ? "Tạm ngừng nhận email" : "Kích hoạt nhận email"}>
                                                <PauseCircleOutlined onClick={() => handleToggleSkill(skill.name)} />
                                            </Tooltip>
                                            <Tooltip title="Xóa kỹ năng">
                                                <DeleteOutlined onClick={() => handleRemoveSkill(skill.name)} />
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