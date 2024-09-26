import { useContext, useEffect, useState } from 'react';
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

import AppContext from '@contexts/AppContext';

import { Api } from '@lib/api';

import Confirmation from '@components/base/Confirmation';
import VideoGenreFrom from '@components/system/VideoGenreForm';

import { VideoGenre } from '@models/System';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const VideoGenres = (): JSX.Element => {
    const [genres, setGenres] = useState<VideoGenre[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [genreToEdit, setGenreToEdit] = useState<VideoGenre | undefined>(undefined);

    const { setSidebarItem } = useContext(AppContext);

    const screens = useBreakpoint();

    const loadGenres = async () => {
        const [data, error] = await Api.Get<VideoGenre[]>('system/video-genre');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setGenres(data ?? []);
        setProcessingMessage('');
    };

    const deleteVideoGenre = async (id: number) => {
        setProcessingMessage('Deleting Genre...');

        const [, error] = await Api.Delete(`system/video-genre/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        await loadGenres();
    }

    useEffect(() => {
        loadGenres();
        setSidebarItem('video-genres');
    }, [setSidebarItem]);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<VideoGenre>['columns'] = [
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
            render: (_, genre: VideoGenre) => (
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
                    {(genre?.tvShowCount ?? 0) > 0 || (genre?.movieCount ?? 0) > 0 ? (
                        <Tooltip placement="top" title={`${genre.name} cannot be deleted as it has TV shows or movies assigned to it.`}>
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
                            onConfirm={() => deleteVideoGenre(genre.videoGenreId)}
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

                    <Title level={1}>Video Genres</Title>

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
                        dataSource={genres}
                        rowKey="videoGenreId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <VideoGenreFrom
                genre={genreToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setGenreToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadGenres();
                    setGenreToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default VideoGenres;
