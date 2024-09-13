import {
    Button,
    Space,
    TableProps,
    Tag,
    Typography,
} from 'antd'
import Confirmation from '@components/base/Confirmation';

import { VideoGameStatus } from '@lib/constants';
import { sortByDate, sortByTitle } from '@lib/sorting';

import StarRating from '@components/StarRating';
import DateDisplay from '@components/DateDisplay/DateDisplay';

import { VideoGame } from '@models/VideoGame';

const { Link } = Typography;

export const VideoGameColumns = (status: VideoGameStatus, isLargeScreen: boolean, onEdit: (videoGame: VideoGame) => void, onDelete: (videoGameId: number) => void): TableProps<VideoGame>['columns'] => {
    switch (status) {
        case VideoGameStatus.ToPlay:
            return getToPlayColumns(isLargeScreen, onEdit, onDelete);
        case VideoGameStatus.InProgress:
            return getPlayingColumns(isLargeScreen, onEdit, onDelete);
        case VideoGameStatus.Completed:
            return getFinishedColumns(isLargeScreen, onEdit, onDelete);
    }
};

const getToPlayColumns = (isLargeScreen: boolean, onEdit: (videoGame: VideoGame) => void, onDelete: (videoGameId: number) => void) => {
    return [
        {
            key: 'sortOrder',
            title: '',
            dataIndex: 'sortOrder',
            width: '2%',
            sorter: (a: VideoGame, b: VideoGame) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: VideoGame, b: VideoGame) => sortByTitle(a.title, b.title),
            render: (_: unknown, { link, title }: VideoGame) => (
                <Link href={link} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'systems',
            title: 'System(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { systems }: VideoGame) => (
                <>
                    {systems.map((s) => <Tag key={s.videoGameSystemId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, videoGame: VideoGame) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(videoGame)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${videoGame.title}'`}
                        onConfirm={() => onDelete(videoGame.videoGameId)}
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

const getPlayingColumns = (isLargeScreen: boolean, onEdit: (videoGame: VideoGame) => void, onDelete: (videoGameId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: VideoGame, b: VideoGame) => sortByTitle(a.title, b.title),
            render: (_: unknown, { link, title }: VideoGame) => (
                <Link href={link} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'systems',
            title: 'System(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { systems }: VideoGame) => (
                <>
                    {systems.map((s) => <Tag key={s.videoGameSystemId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'dateStarted',
            title: 'Date Started',
            width: '25%',
            hidden: !isLargeScreen,
            sorter: (a: VideoGame, b: VideoGame) => sortByDate((a?.dateStarted ?? new Date(1900, 0, 1)).toString(), (b?.dateStarted ?? new Date(1900, 0, 1)).toString()),
            render: (_: unknown, { dateStarted }: VideoGame) => (
                <DateDisplay date={dateStarted} />
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, videoGame: VideoGame) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(videoGame)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${videoGame.title}'`}
                        onConfirm={() => onDelete(videoGame.videoGameId)}
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


const getFinishedColumns = (isLargeScreen: boolean, onEdit: (videoGame: VideoGame) => void, onDelete: (videoGameId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: VideoGame, b: VideoGame) => sortByTitle(a.title, b.title),
            render: (_: unknown, { link, title }: VideoGame) => (
                <Link href={link} target="_blank" rel="noreferrer">{title}</Link>
            )
        },
        {
            key: 'systems',
            title: 'System(s)',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { systems }: VideoGame) => (
                <>
                    {systems.map((s) => <Tag key={s.videoGameSystemId} color={s.colorCode}>{s.name}</Tag>)}
                </>
            )
        },
        {
            key: 'dateCompleted',
            title: 'Date Completed',
            width: '25%',
            hidden: !isLargeScreen,
            sorter: (a: VideoGame, b: VideoGame) => sortByDate((a?.dateCompleted ?? new Date(1900, 0, 1)).toString(), (b?.dateCompleted ?? new Date(1900, 0, 1)).toString()),
            render: (_: unknown, { dateCompleted }: VideoGame) => (
                <DateDisplay date={dateCompleted} />
            )
        },
        {
            key: 'rating',
            title: 'Rating',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { rating }: VideoGame) => (
                <StarRating rating={rating} />
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, videoGame: VideoGame) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(videoGame)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${videoGame.title}'`}
                        onConfirm={() => onDelete(videoGame.videoGameId)}
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
