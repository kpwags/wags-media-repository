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
    Tooltip,
    Typography
} from 'antd';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';

import { Api } from '@lib/api';

import Confirmation from '@components/base/Confirmation';
import LinkCategoryForm from '@components/links/LinkCategoryForm';

import { LinkCategory } from '@models/Link';

const { Title } = Typography;

const LinkCategories = (): JSX.Element => {
    const [categories, setCategories] = useState<LinkCategory[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [categoryToEdit, setCategoryToEdit] = useState<LinkCategory | undefined>(undefined);

    const screens = Grid.useBreakpoint();

    const loadCategories = async () => {
        const [data, error] = await Api.Get<LinkCategory[]>('link/category');

        if (error) {
            setErrorMessage(error);
            setProcessingMessage('');
            return;
        }

        setCategories(data ?? []);
        setProcessingMessage('');
    };

    const deleteLinkCategory = async (id: number) => {
        setProcessingMessage('Deleting Category...');

        const [, error] = await Api.Delete(`link/category/${id}`);

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

    const tableColumns: TableProps<LinkCategory>['columns'] = [
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
            render: (_, category: LinkCategory) => (
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
                    {category.linkCount > 0 ? (
                        <Tooltip placement="top" title={`${category.name} cannot be deleted as it has ${category.linkCount} link(s) assigned to it.`}>
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
                            text={`Are you sure you want to delete '${category.name}'`}
                            onConfirm={() => deleteLinkCategory(category.linkCategoryId)}
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
                    <Button icon={<LeftOutlined />} href="/links">Back to Links</Button>
                    <Title level={1}>Link Categories</Title>
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
                        rowKey="linkCategoryId"
                        pagination={false}
                        loading={processingMessage !== ''}
                    />
                </Space>
            </Row>

            <LinkCategoryForm
                linkCategory={categoryToEdit ?? undefined}
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

export default LinkCategories;
