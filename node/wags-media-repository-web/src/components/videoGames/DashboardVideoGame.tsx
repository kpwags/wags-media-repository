import {
    Space,
    Typography,
} from 'antd';

import { VideoGame } from '@models/VideoGame'

const { Text } = Typography;

type DashboardVideoGameProps = {
    game: VideoGame;
}

const DashboardVideoGame = ({ game }: DashboardVideoGameProps): JSX.Element => (
    <Space direction="vertical" size={8} align="center">
        <img src={game.coverImageUrl} alt={game.title} width={150} height={225} />
        <Text strong>{game.title}</Text>
    </Space>
);

export default DashboardVideoGame;