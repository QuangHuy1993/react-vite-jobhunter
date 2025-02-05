import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '@/styles/loading.module.scss';

const LoadingSpinner = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#991B1B' }} spin />;

  return (
    <div className={styles.loadingContainer}>
      <Spin indicator={antIcon} />
    </div>
  );
};

export default LoadingSpinner;