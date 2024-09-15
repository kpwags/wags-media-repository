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
import BookSeriesForm from '@components/books/BookSeriesForm';

import { BookSeries as Series } from '@models/Book';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const BookSeries = (): JSX.Element => {
    const [bookSeries, setBookSeries] = useState<Series[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [seriesToEdit, setSeriesToEdit] = useState<Series | undefined>(undefined);

    const screens = useBreakpoint();
    const navigate = useNavigate();

    const loadBookSeries = async () => {
        const [data, error] = await Api.Get<Series[]>('book/series');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setBookSeries(data ?? []);
        setProcessingMessage('');
    };

    const deleteSeries = async (id: number) => {
        setProcessingMessage('Deleting Series...');

        const [, error] = await Api.Delete(`book/series/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        await loadBookSeries();
    }

    useEffect(() => {
        loadBookSeries();
    }, []);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<Series>['columns'] = [
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
            render: (_, series: Series) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setSeriesToEdit(series);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    {(series?.bookCount ?? 0) > 0 ? (
                        <Tooltip placement="top" title={`${series.name} cannot be deleted as it has ${series.bookCount} book(s) assigned to it.`}>
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
                            text={`Are you sure you want to delete '${series.name}'`}
                            onConfirm={() => deleteSeries(series.bookSeriesId)}
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

                    <Title level={1}>Book Series</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="end">
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => setShowFormModal(true)}
                        >
                            Add New Series
                        </Button>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={bookSeries}
                        rowKey="bookGenreId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <BookSeriesForm
                series={seriesToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setSeriesToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadBookSeries();
                    setSeriesToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default BookSeries;
