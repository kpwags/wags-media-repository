import {
    Button,
    Space,
    Tag,
    Typography,
} from 'antd'
import Confirmation from '@components/base/Confirmation';

import { BookStatus } from '@lib/constants';
import { sortByDate, sortByText, sortByTitle } from '@lib/sorting';

import StarRating from '@components/StarRating';
import DateDisplay from '@components/DateDisplay/DateDisplay';

import { Book } from '@models/Book';

const { Link } = Typography;

export const BookColumns = (status: BookStatus, isLargeScreen: boolean, onEdit: (book: Book) => void, onDelete: (bookId: number) => void) => {
    switch (status) {
        case BookStatus.ToRead:
            return getToReadColumns(isLargeScreen, onEdit, onDelete);
        case BookStatus.CurrentlyReading:
            return getReadingColumns(isLargeScreen, onEdit, onDelete);
        case BookStatus.Finished:
        case BookStatus.Abandoned:
            return getFinishedColumns(isLargeScreen, onEdit, onDelete);
    }
};

const getToReadColumns = (isLargeScreen: boolean, onEdit: (book: Book) => void, onDelete: (bookId: number) => void) => {
    return [
        {
            key: 'sortOrder',
            title: '',
            dataIndex: 'sortOrder',
            width: '2%',
            sorter: (a: Book, b: Book) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '25%',
            sorter: (a: Book, b: Book) => sortByTitle(a.fullTitle, b.fullTitle),
            render: (_: unknown, { link, fullTitle }: Book) => (
                <Link href={link} target="_blank" rel="noreferrer">{fullTitle}</Link>
            )
        },
        {
            key: 'author',
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            sorter: (a: Book, b: Book) => sortByText(a.author, b.author),
        },
        {
            key: 'type',
            title: 'Type',
            width: '15%',
            hidden: !isLargeScreen,
            render: (_: unknown, { type }: Book) => (
                <Tag color={type?.colorCode}>{type?.name}</Tag>
            )
        },
        {
            key: 'series',
            title: 'Series',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { series }: Book) => (
                <>
                    {series ? (
                        <Tag color={series?.colorCode}>{series?.name}</Tag>
                    ) : null}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, book: Book) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(book)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${book.fullTitle}'`}
                        onConfirm={() => onDelete(book.bookId)}
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
        },
    ];
};

const getReadingColumns = (isLargeScreen: boolean, onEdit: (book: Book) => void, onDelete: (bookId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            sorter: (a: Book, b: Book) => sortByTitle(a.fullTitle, b.fullTitle),
            render: (_: unknown, { link, fullTitle }: Book) => (
                <Link href={link} target="_blank" rel="noreferrer">{fullTitle}</Link>
            )
        },
        {
            key: 'author',
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            sorter: (a: Book, b: Book) => sortByText(a.author, b.author),
        },
        {
            key: 'dateStarted',
            title: 'Date Started',
            width: '15%',
            hidden: !isLargeScreen,
            sorter: (a: Book, b: Book) => sortByDate((a?.dateStarted ?? new Date(1900, 0, 1)).toString(), (b?.dateStarted ?? new Date(1900, 0, 1)).toString()),
            render: (_: unknown, { dateStarted }: Book) => (
                <DateDisplay date={dateStarted} />
            )
        },
        {
            key: 'progress',
            title: 'Progress',
            dataIndex: 'progress',
            width: '8%',
            align: 'center',
            render: (_: unknown, { progress }: Book) => <>{progress}%</>
        },
        {
            key: 'series',
            title: 'Series',
            width: '15%',
            hidden: !isLargeScreen,
            render: (_: unknown, { series }: Book) => (
                <>
                    {series ? (
                        <Tag color={series?.colorCode}>{series?.name}</Tag>
                    ) : null}
                </>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, book: Book) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(book)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${book.fullTitle}'`}
                        onConfirm={() => onDelete(book.bookId)}
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
        },
    ];
};

const getFinishedColumns = (isLargeScreen: boolean, onEdit: (book: Book) => void, onDelete: (bookId: number) => void) => {
    return [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'fullTitle',
            width: '30%',
            sorter: (a: Book, b: Book) => sortByTitle(a.fullTitle, b.fullTitle),
            render: (_: unknown, { link, fullTitle }: Book) => (
                <Link href={link} target="_blank" rel="noreferrer">{fullTitle}</Link>
            )
        },
        {
            key: 'author',
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            sorter: (a: Book, b: Book) => sortByText(a.author, b.author),
        },
        {
            key: 'dateCompleted',
            title: 'Date Completed',
            width: '25%',
            hidden: !isLargeScreen,
            sorter: (a: Book, b: Book) => sortByDate((a?.dateCompleted ?? new Date(1900, 0, 1)).toString(), (b?.dateCompleted ?? new Date(1900, 0, 1)).toString()),
            render: (_: unknown, { dateCompleted }: Book) => (
                <DateDisplay date={dateCompleted} />
            )
        },
        {
            key: 'rating',
            title: 'Rating',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_: unknown, { rating }: Book) => (
                <StarRating rating={rating} />
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_: unknown, book: Book) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => onEdit(book)}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${book.fullTitle}'`}
                        onConfirm={() => onDelete(book.bookId)}
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
