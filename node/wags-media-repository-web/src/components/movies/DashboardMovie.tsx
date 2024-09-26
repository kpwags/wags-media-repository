import {
    Space,
    Typography,
} from 'antd';
import dayjs from 'dayjs';

import { Movie } from '@models/Movie'
import StarRating from '@components/StarRating';

const { Text } = Typography;

type DashboardMovieProps = {
    movie: Movie;
}

const DashboardMovie = ({ movie }: DashboardMovieProps): JSX.Element => (
    <Space direction="horizontal" size={24} align="start" className="currently-reading recently-read">
        <img
            src={movie.posterImageUrl}
            alt={movie.title}
            width={133}
            height={200}
        />
        <Space direction="vertical" size={16} className="details">
            <Text strong>{movie.title}</Text>
            <Text><Text strong>Watched:</Text> {dayjs(movie.dateWatched).format('MM/DD/YYYY')}</Text>
            <StarRating rating={movie.rating} />
        </Space>
    </Space>
);

export default DashboardMovie;