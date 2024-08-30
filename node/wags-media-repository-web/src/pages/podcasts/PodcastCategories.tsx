import { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    Row,
    Space,
    Table,
    TableProps,
    Typography
} from 'antd';

import { Api } from '@lib/api';

import { PodcastCategory } from '@models/Podcast';
import Confirmation from '@components/base/Confirmation';

const { Title, Link } = Typography;

const PodcastCategories = (): JSX.Element => {
    const [categories, setCategories] = useState<PodcastCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const screens = Grid.useBreakpoint();

    const loadCategories = async () => {
        const [data, error] = await Api.Get<PodcastCategory[]>('podcasts/categories');

        if (error) {
            setLoading(false);
            return;
        }

        setCategories(data ?? []);
        setLoading(false);
    };

    const deletePodcastCategory = async (id: number) => {
        setLoading(true);
        const [, error] = await Api.Delete(`podcasts/categories/${id}`);

        if (error) {
            setLoading(false);
            return;
        }

        await loadCategories();
    }

    useEffect(() => {
        loadCategories();
    }, []);

    const isLargeScreen = screens.md || screens.lg || screens.xl || screens.xxl;

    const tableColumns: TableProps<PodcastCategory>['columns'] = [
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
            render: (_, { podcastCategoryId, name }: PodcastCategory) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Link href={`/podcasts/categories/edit/${podcastCategoryId}`}>Edit</Link>
                    <Confirmation
                        text={`Are you sure you want to delete '${name}'`}
                        onConfirm={() => deletePodcastCategory(podcastCategoryId)}
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
        <Row justify="start" className="slim-table">
            <Space direction="vertical" size={24} className="full-width">
                <Title level={1}>Podcast Categories</Title>
                <Row justify="end">
                    <Button
                        type="primary"
                        htmlType="button"
                        onClick={() => { }}
                    >
                        Add New Category
                    </Button>
                </Row>
                <Table
                    columns={tableColumns}
                    dataSource={categories}
                    rowKey="podcastCategoryId"
                    pagination={false}
                    loading={loading}
                />
            </Space>
        </Row>
    );
}

export default PodcastCategories;
