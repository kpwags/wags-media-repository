import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Form,
    Grid,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Table,
    TableProps,
    Tag,
    Typography
} from 'antd';

import usePodcastCategories from '@hooks/usePodcastCategories';

import { Api } from '@lib/api';

import { Podcast } from '@models/Podcast';
import Confirmation from '@components/base/Confirmation';
import PodcastForm from '@components/podcasts/PodcastForm';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const PodcastsHome = (): JSX.Element => {
    const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ name: string, categoryId: number }>({ name: '', categoryId: 0 });
    const [podcastToEdit, setPodcastToEdit] = useState<Podcast | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const { podcastCategories, error, isLoading } = usePodcastCategories();

    const screens = useBreakpoint();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : fetchError;
    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    const fetchPodcasts = async (): Promise<[Podcast[] | null, string | null]> => await await Api.Get<Podcast[]>('podcasts');

    const loadPodcasts = useCallback(async () => {
        const [data, error] = await fetchPodcasts();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        setPodcasts(data ?? []);
        setAllPodcasts(data ?? []);
        setProcessingMessage('');
    }, []);

    const deletePodcast = async (id: number) => {
        setProcessingMessage('Deleting podcast...');
        const [, error] = await Api.Delete(`podcasts/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadPodcasts();
    };

    const filterPodcastsByName = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            name: filterText.trim(),
        });
    };

    const filterPodcastsByCategory = (categoryId: number) => {
        setActiveFilters({
            ...activeFilters,
            categoryId: categoryId ?? 0,
        });
    };

    useEffect(() => {
        loadPodcasts();
    }, [loadPodcasts]);

    useEffect(() => {
        if (activeFilters.categoryId === 0 && activeFilters.name.trim() === '') {
            setPodcasts(allPodcasts);
            return;
        }

        if (activeFilters.categoryId === 0 && activeFilters.name.trim() !== '') {
            setPodcasts(allPodcasts.filter((p) => p.name.toLocaleLowerCase().includes(activeFilters.name.toLocaleLowerCase())));
            return;
        }

        if (activeFilters.categoryId > 0 && activeFilters.name.trim() === '') {
            setPodcasts(allPodcasts.filter((p) => p.podcastCategoryId === activeFilters.categoryId));
            return;
        }

        setPodcasts(allPodcasts.filter((p) => p.podcastCategoryId === activeFilters.categoryId && p.name.toLocaleLowerCase().includes(activeFilters.name.toLocaleLowerCase())));
    }, [allPodcasts, activeFilters]);

    const tableColumns: TableProps<Podcast>['columns'] = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            width: '30%',
        },
        {
            key: 'category',
            title: 'Category',
            width: '25%',
            hidden: !isLargeScreen,
            render: (_, podcast: Podcast) => (
                <Tag color={podcast.category.colorCode}>{podcast.category.name}</Tag>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, podcast: Podcast) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setPodcastToEdit(podcast);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${podcast.name}'`}
                        onConfirm={() => deletePodcast(podcast.podcastId)}
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
    ]

    return (
        <>
            <Spin spinning={loadingMessage !== ''} tip={loadingMessage}>
                <Space direction="vertical" size={24} className="full-width">
                    <Title level={1}>Podcasts</Title>
                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}
                    <Row justify="space-between" align="bottom" className="filter-actions">
                        <Space direction="vertical" size={8} className="table-filter">
                            <Text strong>Filters</Text>
                            <Form.Item label="Name">
                                <Input
                                    placeholder="Enter Podcast Name"
                                    onChange={(e) => {
                                        filterPodcastsByName(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Category">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Category"
                                    onChange={(e) => {
                                        filterPodcastsByCategory(e);
                                    }}
                                    allowClear
                                    options={(podcastCategories ?? []).map((pc) => ({ key: pc.podcastCategoryId, label: pc.name, value: pc.podcastCategoryId }))} />
                            </Form.Item>
                        </Space>
                        <Space direction="horizontal" size={16}>
                            <Button href="/podcasts/categories">
                                Categories
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New Podcast
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={podcasts}
                        rowKey="podcastId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <PodcastForm
                podcast={podcastToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setPodcastToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadPodcasts();
                    setPodcastToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default PodcastsHome;
