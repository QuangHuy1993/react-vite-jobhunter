import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permissions';
import { useAppSelector } from "@/redux/hooks";
import { IUser } from "@/types/backend";

const JobTabs = () => {
    const user = useAppSelector(state => state.account.user) as IUser;
    const isSuperAdmin = user?.role?.name === "SUPER_ADMIN";

    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Jobs',
            children: <JobPage />,
        },
        ...(isSuperAdmin ? [{
            key: '2',
            label: 'Manage Skills',
            children: <SkillPage />,
        }] : [])
    ];
    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={onChange}
                />
            </Access>
        </div>
    );
}

export default JobTabs;