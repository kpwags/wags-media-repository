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
import VideoServiceForm from '@components/system/VideoServiceForm';

import { VideoService } from '@models/System';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const VideoServices = (): JSX.Element => {
    const [videoServices, setVideoServices] = useState<VideoService[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [videoServiceToEdit, setVideoServiceToEdit] = useState<VideoService | undefined>(undefined);

    const { setSidebarItem } = useContext(AppContext);
    const screens = useBreakpoint();

    const loadVideoServices = async () => {
        const [data, error] = await await Api.Get<VideoService[]>('system/video-service');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setVideoServices(data ?? []);
        setProcessingMessage('');
    };

    const deletePodcastCategory = async (id: number) => {
        setProcessingMessage('Deleting Video Service...');

        const [, error] = await Api.Delete(`system/video-service/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        await loadVideoServices();
    }

    useEffect(() => {
        loadVideoServices();
        setSidebarItem('video-services');
    }, [setSidebarItem]);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<VideoService>['columns'] = [
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
            render: (_, videoService: VideoService) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setVideoServiceToEdit(videoService);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    {(videoService.tvShowCount ?? 0) > 0 || (videoService.movieCount ?? 0) > 0 ? (
                        <Tooltip placement="top" title={`${videoService.name} cannot be deleted as it has ${(videoService?.tvShowCount ?? 0) + (videoService?.movieCount ?? 0)} item(s) assigned to it.`}>
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
                            text={`Are you sure you want to delete '${videoService.name}'`}
                            onConfirm={() => deletePodcastCategory(videoService.videoServiceId)}
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
                    <Title level={1}>Video Services</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="end">
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => setShowFormModal(true)}
                        >
                            Add New Service
                        </Button>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={videoServices}
                        rowKey="videoServiceId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <VideoServiceForm
                videoService={videoServiceToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setVideoServiceToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadVideoServices();
                    setVideoServiceToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default VideoServices;
