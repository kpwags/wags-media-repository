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
import VideoGameSystemForm from '@components/videoGames/VideoGameSystemForm';

import { VideoGameSystem } from '@models/VideoGame';

const { useBreakpoint } = Grid;
const { Title } = Typography;

const VideoGameSystems = (): JSX.Element => {
    const [videoGameSystems, setVideoGameSystems] = useState<VideoGameSystem[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [systemToEdit, setSystemToEdit] = useState<VideoGameSystem | undefined>(undefined);

    const screens = useBreakpoint();
    const navigate = useNavigate();

    const loadVideoGameSystems = async () => {
        const [data, error] = await Api.Get<VideoGameSystem[]>('video-game/system');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setVideoGameSystems(data ?? []);
        setProcessingMessage('');
    };

    const deleteSystem = async (id: number) => {
        setProcessingMessage('Deleting System...');

        const [, error] = await Api.Delete(`video-game/system/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        await loadVideoGameSystems();
    }

    useEffect(() => {
        loadVideoGameSystems();
    }, []);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<VideoGameSystem>['columns'] = [
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
            render: (_, system: VideoGameSystem) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setSystemToEdit(system);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    {(system?.videoGameCount ?? 0) > 0 ? (
                        <Tooltip placement="top" title={`${system.name} cannot be deleted as it has ${system.videoGameCount} games(s) assigned to it.`}>
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
                            text={`Are you sure you want to delete '${system.name}'`}
                            onConfirm={() => deleteSystem(system.videoGameSystemId)}
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
                    <Button icon={<LeftOutlined />} onClick={() => navigate(-1)}>Back to Video Games</Button>

                    <Title level={1}>Video Game Systems</Title>

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
                        dataSource={videoGameSystems}
                        rowKey="videoGameSystemId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <VideoGameSystemForm
                system={systemToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setSystemToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadVideoGameSystems();
                    setSystemToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default VideoGameSystems;
