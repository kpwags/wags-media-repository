import {
    Button,
    Space,
    TableProps,
    Tag,
    Typography,
} from 'antd'

import { MovieStatus } from '@lib/constants';
import { sortByDate } from '@lib/sorting';

import Confirmation from '@components/base/Confirmation';

import { Movie } from '@models/Movie';
import StarRating from '@components/StarRating';
import DateDisplay from '@components/DateDisplay/DateDisplay';

const { Link } = Typography;

export const getMovieTableColumns = (status: MovieStatus, isLargeScreen: boolean, onEdit: (movie: Movie) => void, onDelete: (movieId: number) => void): TableProps<Movie>['columns'] => {
    switch (status) {
        case MovieStatus.PersonalToWatch:
        case MovieStatus.JointToWatch:
            return getToWatchTableColumns(isLargeScreen, onEdit, onDelete);
        case MovieStatus.Watched:
        case MovieStatus.CouldNotFinish:
            return getWatchedTableColumns(isLargeScreen, onEdit, onDelete);
    }
};

const getToWatchTableColumns = (isLargeScreen: boolean, onEdit: (movie: Movie) => void, onDelete: (movieId: number) => void) => {
    return [
        {
            key: 'sortOrder',
            title: '',
            dataIndex: 'sortOrder',
            width: '2%',
            sorter: (a: Movie, b: Movie) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: Movie, b: Movie) => (a.title).localeCompare(b.title),
            render: (_: unknown, { imdbLink, title }: Movie) => (
                <Link href={imdbLink} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'genre',
            title: 'Genre(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, movie: Movie) => (
                <>
                    {movie.genres.map((g) => <Tag key={g.videoGenreId} color={g.colorCode}>{g.name}</Tag>)}
                </>
            )
        },
        {
            key: 'service',
            title: 'Service(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, movie: Movie) => (
                <>
                    {movie.services.map((s) => <Tag key={s.videoServiceId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, movie: Movie) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(movie)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${movie.title}'`}
                        onConfirm={() => onDelete(movie.movieId)}
                    >
                        <Button
                            type="link"
                            htmlType="button"
                        >
                            Delete
                        </Button>
                    </Confirmation>
                </Space>
            )
        }
    ];
}

const getWatchedTableColumns = (isLargeScreen: boolean, onEdit: (movie: Movie) => void, onDelete: (movieId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: Movie, b: Movie) => (a.title).localeCompare(b.title),
            render: (_: unknown, { imdbLink, title }: Movie) => (
                <Link href={imdbLink} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'dateWatched',
            title: 'Date Watched',
            width: '25%',
            hidden: !isLargeScreen,
            sorter: (a: Movie, b: Movie) => sortByDate(a.dateWatched.toString(), b.dateWatched.toString()),
            render: (_: unknown, { dateWatched }: Movie) => (
                <DateDisplay date={dateWatched} />
            )
        },
        {
            key: 'rating',
            title: 'Rating',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { rating }: Movie) => (
                <StarRating rating={rating} />
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, movie: Movie) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(movie)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${movie.title}'`}
                        onConfirm={() => onDelete(movie.movieId)}
                    >
                        <Button
                            type="link"
                            htmlType="button"
                        >
                            Delete
                        </Button>
                    </Confirmation>
                </Space>
            )
        }
    ];
}