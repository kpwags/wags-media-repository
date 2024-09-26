import {
    Button,
    Progress,
    Space,
    Typography,
} from 'antd';

import { TelevisionShow } from '@models/Tv'

const { Text } = Typography;

type DashboardTelevisionShowProps = {
    tvShow: TelevisionShow;
    onUpdateProgress: (tvShow: TelevisionShow) => void;
}

const DashboardTelevisionShow = ({ tvShow, onUpdateProgress }: DashboardTelevisionShowProps): JSX.Element => (
    <Space direction="horizontal" size={24} align="start" className="currently-reading">
        <img src={tvShow.coverImageUrl} alt={tvShow.title} width={150} height={225} />
        <Space direction="vertical" size={16} className="details">
            <Text strong>{tvShow.title}</Text>
            {tvShow.seasonEpisodeCount > 1 ? (
                <>
                    <Progress type="circle" percent={tvShow.progress} />
                    <Button type="primary" htmlType="button" onClick={() => onUpdateProgress(tvShow)}>Update Progress</Button>
                </>
            ) : null}
        </Space>
    </Space>
);

export default DashboardTelevisionShow;