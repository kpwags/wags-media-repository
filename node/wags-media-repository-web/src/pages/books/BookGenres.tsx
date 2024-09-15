import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Button,
    Grid,
    Row,
    Space,
    Spin,
    Table,
    TableProps,
    Tooltip,
    Typography
} from 'antd';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';

import { Api } from '@lib/api';

import Confirmation from '@components/base/Confirmation';
import BookGenreForm from '@components/books/BookGenreForm';

import { BookGenre } from '@models/Book';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const BookGenres = (): JSX.Element => {
    const [bookGenres, setBookGenres] = useState<BookGenre[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [genreToEdit, setGenreToEdit] = useState<BookGenre | undefined>(undefined);

    const screens = useBreakpoint();
    const navigate = useNavigate();

    const loadBookGenres = async () => {
        const [data, error] = await Api.Get<BookGenre[]>('book/genre');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setBookGenres(data ?? []);
        setProcessingMessage('');
    };

    const deleteGenre = async (id: number) => {
        setProcessingMessage('Deleting Genre...');

        const [, error] = await Api.Delete(`book/genre/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        await loadBookGenres();
    }

    useEffect(() => {
        loadBookGenres();
    }, []);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<BookGenre>['columns'] = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: '70%',
        },
        {
            key: 'actions',
            title: 'Actions',
            align: 'center',
            width: '30%',
            render: (_, genre: BookGenre) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setGenreToEdit(genre);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    {(genre?.bookCount ?? 0) > 0 ? (
                        <Tooltip placement="top" title={`${genre.name} cannot be deleted as it has ${genre.bookCount} book(s) assigned to it.`}>
                            <Button
                                type="link"
                                htmlType="button"
                                disabled
                            >
                                Delete
                            </Button>
                        </Tooltip>
                    ) : (
                        <Confirmation
                            text={`Are you sure you want to delete '${genre.name}'`}
                            onConfirm={() => deleteGenre(genre.bookGenreId)}
                        >
                            <Button
                                type="link"
                                htmlType="button"
                            >
                                Delete
                            </Button>
                        </Confirmation>
                    )}
                </Space>
            )
        }
    ]

    return (
        <Spin spinning={processingMessage !== ''} tip={processingMessage}>
            <Row justify="start" className="slim-table">
                <Space direction="vertical" size={24} className="full-width">
                    <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Back to Books</Button>

                    <Title level={1}>Book Genres</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="end">
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => setShowFormModal(true)}
                        >
                            Add New Genre
                        </Button>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={bookGenres}
                        rowKey="bookGenreId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <BookGenreForm
                genre={genreToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setGenreToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadBookGenres();
                    setGenreToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default BookGenres;
