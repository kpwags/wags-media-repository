import {
    Button,
    Space,
    TableProps,
    Tag,
    Typography,
} from 'antd'
import Confirmation from '@components/base/Confirmation';

import { TvStatus } from '@lib/constants';

import { TelevisionShow } from '@models/Tv';
import StarRating from '@components/StarRating';

const { Link } = Typography;

export const getTvShowColumns = (status: TvStatus, isLargeScreen: boolean, onEdit: (tvShow: TelevisionShow) => void, onDelete: (tvShowId: number) => void): TableProps<TelevisionShow>['columns'] => {
    switch (status) {
        case TvStatus.PersonalToWatch:
        case TvStatus.JointToWatch:
            return getToWatchTableColumns(isLargeScreen, onEdit, onDelete);
        case TvStatus.InBetweenSeasons:
        case TvStatus.CurrentlyWatching:
            return getWatchingTableColumns(isLargeScreen, onEdit, onDelete);
        case TvStatus.Finished:
        case TvStatus.CouldNotFinish:
            return getWatchedTableColumns(isLargeScreen, onEdit, onDelete);
    }
};

const getToWatchTableColumns = (isLargeScreen: boolean, onEdit: (tvShow: TelevisionShow) => void, onDelete: (tvShowId: number) => void) => {
    return [
        {
            key: 'sortOrder',
            title: '',
            dataIndex: 'sortOrder',
            width: '2%',
            sorter: (a: TelevisionShow, b: TelevisionShow) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: TelevisionShow, b: TelevisionShow) => (a.title).localeCompare(b.title),
            render: (_: unknown, { imdbLink, title }: TelevisionShow) => (
                <Link href={imdbLink} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'genre',
            title: 'Genre(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, tvShow: TelevisionShow) => (
                <>
                    {tvShow.genres.map((g) => <Tag key={g.videoGenreId} color={g.colorCode}>{g.name}</Tag>)}
                </>
            )
        },
        {
            key: 'service',
            title: 'Service(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, tvShow: TelevisionShow) => (
                <>
                    {tvShow.services.map((s) => <Tag key={s.videoServiceId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, tvShow: TelevisionShow) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(tvShow)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${tvShow.title}'`}
                        onConfirm={() => onDelete(tvShow.televisionShowId)}
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
};


const getWatchingTableColumns = (isLargeScreen: boolean, onEdit: (tvShow: TelevisionShow) => void, onDelete: (tvShowId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: TelevisionShow, b: TelevisionShow) => (a.title).localeCompare(b.title),
            render: (_: unknown, { imdbLink, title }: TelevisionShow) => (
                <Link href={imdbLink} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'progress',
            title: 'Progress',
            dataIndex: 'progress',
            width: '10%',
            render: (_: unknown, { progress }: TelevisionShow) => <>{progress}%</>
        },
        {
            key: 'service',
            title: 'Service(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, tvShow: TelevisionShow) => (
                <>
                    {tvShow.services.map((s) => <Tag key={s.videoServiceId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, tvShow: TelevisionShow) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(tvShow)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${tvShow.title}'`}
                        onConfirm={() => onDelete(tvShow.televisionShowId)}
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

const getWatchedTableColumns = (isLargeScreen: boolean, onEdit: (tvShow: TelevisionShow) => void, onDelete: (tvShowId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: TelevisionShow, b: TelevisionShow) => (a.title).localeCompare(b.title),
            render: (_: unknown, { imdbLink, title }: TelevisionShow) => (
                <Link href={imdbLink} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'rating',
            title: 'Rating',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { rating }: TelevisionShow) => (
                <StarRating rating={rating} />
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, tvShow: TelevisionShow) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(tvShow)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${tvShow.title}'`}
                        onConfirm={() => onDelete(tvShow.televisionShowId)}
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
};