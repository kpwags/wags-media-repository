import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Grid,
    Row,
    Space,
    Spin,
    Table,
    TableProps,
    Typography
} from 'antd';

import { Api } from '@lib/api';

import { PodcastCategory } from '@models/Podcast';
import Confirmation from '@components/base/Confirmation';
import PodcastCategoryForm from '@components/podcasts/PodcastCategoryForm';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';

const { Title } = Typography;

const PodcastCategories = (): JSX.Element => {
    const [categories, setCategories] = useState<PodcastCategory[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<PodcastCategory | undefined>(undefined);

    const screens = Grid.useBreakpoint();

    const loadCategories = async () => {
        const [data, error] = await Api.Get<PodcastCategory[]>('podcasts/categories');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setCategories(data ?? []);
        setProcessingMessage('');
    };

    const deletePodcastCategory = async (id: number) => {
        setProcessingMessage('Deleting Category...');

        const [, error] = await Api.Delete(`podcasts/categories/${id}`);

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
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
            render: (_, category: PodcastCategory) => (
                <Space direction={isLargeScreen ? 'horizontal' : 'vertical'} size={isLargeScreen ? 16 : 8}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setCategoryToEdit(category);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${category.name}'`}
                        onConfirm={() => deletePodcastCategory(category.podcastCategoryId)}
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
            <Row justify="start" className="slim-table">
                <Space direction="vertical" size={24} className="full-width">
                    <Button icon={<LeftOutlined />} href="/podcasts">Back to Podcasts</Button>
                    <Title level={1}>Podcast Categories</Title>
                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}
                    <Row justify="end">
                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => setShowFormModal(true)}
                        >
                            Add New Category
                        </Button>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={categories}
                        rowKey="podcastCategoryId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <PodcastCategoryForm
                podcastCategory={categoryToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setCategoryToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadCategories();
                    setCategoryToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </Spin>
    );
}

export default PodcastCategories;
