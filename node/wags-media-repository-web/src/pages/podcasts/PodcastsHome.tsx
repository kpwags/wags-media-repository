import { useEffect, useState } from 'react';
import {
    Button,
    Row,
    Space,
    Table,
    TableProps,
    Tag,
    Typography
} from 'antd';

import { Api } from '@lib/api';

import { Podcast } from '@models/Podcast';
import Confirmation from '@components/base/Confirmation';

const { Title, Link } = Typography;

const PodcastsHome = (): JSX.Element => {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadPodcasts = async () => {
        const [data, error] = await Api.Get<Podcast[]>('podcasts');

        if (error) {
            setLoading(false);
            return;
        }

        setPodcasts(data ?? []);
        setLoading(false);
    };

    const deletePodcast = async (id: number) => {
        setLoading(true);
        const [, error] = await Api.Delete(`podcasts/${id}`);

        if (error) {
            setLoading(false);
            return;
        }

        await loadPodcasts();
    }

    useEffect(() => {
        loadPodcasts();
    }, []);

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
        <Space direction="vertical" size={24} className="full-width">
            <Title level={1}>Podcasts</Title>
            <Row justify="end">
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
                loading={loading}
            />
        </Space>
    );
}

export default PodcastsHome;
