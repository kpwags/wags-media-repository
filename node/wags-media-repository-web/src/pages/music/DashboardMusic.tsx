import {
    Space,
    Typography,
} from 'antd';

import { MusicAlbum } from '@models/Music'

const { Text } = Typography;

type CurrentlyListeningToProps = {
    album: MusicAlbum;
}

const CurrentlyListeningTo = ({ album }: CurrentlyListeningToProps): JSX.Element => (
    <Space direction="vertical" size={8} align="center">
        <img src={album.coverImageUrl} alt={`${album.title} by ${album.artist}`} width={150} height={150} />
        <div style={{ maxWidth: 150 }}>
            <Text>
                <Text strong>{album.title}</Text><br />
                {album.artist}
            </Text>
        </div>
    </Space>
);

export default CurrentlyListeningTo;