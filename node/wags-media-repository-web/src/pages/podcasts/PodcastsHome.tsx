import { useEffect, useState } from 'react';
import {
    Button,
    Form,
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

import { Api } from '@lib/api';

import { Podcast, PodcastCategory } from '@models/Podcast';
import Confirmation from '@components/base/Confirmation';

const { Text, Title, Link } = Typography;

const PodcastsHome = (): JSX.Element => {
    const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [podcastCategories, setPodcastCategories] = useState<PodcastCategory[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ name: string, categoryId: number }>({ name: '', categoryId: 0 });

    const fetchPodcasts = async (): Promise<[Podcast[] | null, string | null]> => await await Api.Get<Podcast[]>('podcasts');
    const fetchPodcastCategories = async (): Promise<[PodcastCategory[] | null, string | null]> => {
        return await await Api.Get<PodcastCategory[]>('podcasts/categories');
    }

    const loadPodcasts = async () => {
        const [data, error] = await fetchPodcasts();

        if (error) {
            setProcessingMessage('');
            return;
        }

        setPodcasts(data ?? []);
        setAllPodcasts(data ?? []);
        setProcessingMessage('');
    };

    const loadPageData = async () => {
        const [
            [podcastData, podcastError],
            [podcastCategoryData, podcastCatgeoryError]
        ] = await Promise.all([
            fetchPodcasts(),
            fetchPodcastCategories(),
        ]);

        if (podcastError || podcastCatgeoryError) {
            setProcessingMessage('');
            return;
        }

        setPodcasts(podcastData ?? []);
        setAllPodcasts(podcastData ?? []);
        setPodcastCategories(podcastCategoryData ?? []);

        setProcessingMessage('');
    };

    const deletePodcast = async (id: number) => {
        setProcessingMessage('Deleting podcast...');
        const [, error] = await Api.Delete(`podcasts/${id}`);

        if (error) {
            setProcessingMessage('');
            return;
        }

        await loadPodcasts();
    }

    const filterPodcastsByName = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            name: filterText.trim(),
        });
    };

    const filterPodcastsByCategory = (categoryId: number) => {
        setActiveFilters({
            ...activeFilters,
            categoryId,
        });
    };

    useEffect(() => {
        loadPageData();
    }, []);

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
            render: (_, podcast: Podcast) => (
                <Tag color={podcast.category.colorCode}>{podcast.category.name}</Tag>
            )
        },
        {
            key: 'link',
            title: 'Link',
            width: '25%',
            render: (_, { link }: Podcast) => (
                <Link href={link} target="_blank" rel="nofollow" className="table-link">{link}</Link>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, { podcastId, name }: Podcast) => (
                <Space direction="horizontal" size={4}>
                    <Link href={`/podcasts/edit/${podcastId}`}>Edit</Link>
                    <Confirmation
                        text={`Are you sure you want to delete '${name}'`}
                        onConfirm={() => deletePodcast(podcastId)}
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
        <Spin spinning={processingMessage !== ''} tip={processingMessage}>
            <Space direction="vertical" size={24} className="full-width">
                <Title level={1}>Podcasts</Title>
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
                                options={podcastCategories.map((pc) => ({ key: pc.podcastCategoryId, label: pc.name, value: pc.podcastCategoryId }))} />
                        </Form.Item>
                    </Space>
                    <Space direction="horizontal" size={8}>
                        <Button href="/podcasts/categories">
                            Categories
                        </Button>
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => { }}
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
                    loading={processingMessage !== ''}
                />
            </Space>
        </Spin>
    );
}

export default PodcastsHome;
