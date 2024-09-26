import { useCallback, useContext, useEffect, useState } from 'react';
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

import AppContext from '@contexts/AppContext';

import useLinkCategories from '@hooks/useLinkCategories';

import { Api } from '@lib/api';
import { sortByDate } from '@lib/sorting';

import Confirmation from '@components/base/Confirmation';
import DateDisplay from '@components/DateDisplay/DateDisplay';
import LinkForm from '@components/links/LinkForm';

import { Link } from '@models/Link';

const { useBreakpoint } = Grid;
const {
    Link: Anchor,
    Text,
    Title,
} = Typography;

const LinksHome = (): JSX.Element => {
    const [allLinks, setAllLinks] = useState<Link[]>([]);
    const [activeFilters, setActiveFilters] = useState<{ name: string, categoryId: number, typeId: number }>({ name: '', categoryId: 0, typeId: 0 });
    const [fetchError, setFetchError] = useState<string>('');
    const [links, setLinks] = useState<Link[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [linkToEdit, setLinkToEdit] = useState<Link | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const { setSidebarItem } = useContext(AppContext);

    const { linkCategories, error, isLoading } = useLinkCategories();

    const screens = useBreakpoint();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : fetchError;
    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    const fetchLinks = async (): Promise<[Link[] | null, string | null]> => await await Api.Get<Link[]>('link');

    const loadLinks = useCallback(async () => {
        const [data, error] = await fetchLinks();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        setLinks(data ?? []);
        setAllLinks(data ?? []);
        setProcessingMessage('');
    }, []);

    const deleteLink = async (id: number) => {
        setProcessingMessage('Deleting link...');
        const [, error] = await Api.Delete(`link/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadLinks();
    };

    const filterLinksByName = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            name: filterText.trim(),
        });
    };

    const filterLinksByCategory = (categoryId: number) => {
        setActiveFilters({
            ...activeFilters,
            categoryId: categoryId ?? 0,
        });
    };

    const filterLinksByType = (typeId: number) => {
        setActiveFilters({
            ...activeFilters,
            typeId: typeId ?? 0,
        });
    };

    useEffect(() => {
        loadLinks();
        setSidebarItem('links');
    }, [loadLinks, setSidebarItem]);

    useEffect(() => {
        if (activeFilters.categoryId === 0 && activeFilters.typeId === 0 && activeFilters.name.trim() === '') {
            setLinks(allLinks);
            return;
        }

        const { categoryId, typeId, name } = activeFilters;

        setLinks(allLinks.filter((link) => {
            if (name.trim() !== '' && (link.title.toLocaleLowerCase().includes(name.toLocaleLowerCase()) || link.author.toLocaleLowerCase().includes(name.toLocaleLowerCase()))) {
                return link;
            }

            if (categoryId > 0 && link.linkCategoryId === categoryId) {
                return link;
            }

            if (typeId > 0 && link.linkTypeId === typeId) {
                return link;
            }
        }));
    }, [allLinks, activeFilters]);

    const tableColumns: TableProps<Link>['columns'] = [
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '30%',
            render: (_, { title, url }: Link) => (
                <Anchor href={url} target="_blank" rel="noreferrer">{title}</Anchor>
            ),
        },
        {
            key: 'author',
            title: 'Author',
            dataIndex: 'author',
            width: '20%',
            hidden: !isLargeScreen,
        },
        {
            key: 'linkDate',
            title: 'Date',
            width: '15%',
            hidden: !isLargeScreen,
            sorter: (a: Link, b: Link) => sortByDate(a.linkDate.toString(), b.linkDate.toString()),
            render: (_, link: Link) => (
                <DateDisplay date={link.linkDate} />
            )
        },
        {
            key: 'readingLogIssueNumber',
            title: 'Issue',
            dataIndex: 'readingLogIssueNumber',
            width: '5%',
            hidden: !isLargeScreen,
        },
        {
            key: 'type',
            title: 'Type',
            width: '10%',
            hidden: !isLargeScreen,
            render: (_, link: Link) => (
                <Tag color={link.type.colorCode}>{link.type.name}</Tag>
            )
        },
        {
            key: 'category',
            title: 'Category',
            width: '10%',
            hidden: !isLargeScreen,
            render: (_, link: Link) => (
                <Tag color={link.category.colorCode}>{link.category.name}</Tag>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, link: Link) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setLinkToEdit(link);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Confirmation
                        text="Are you sure you want to delete this link?"
                        onConfirm={() => deleteLink(link.linkId)}
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
    ];

    return (
        <>
            <Spin spinning={loadingMessage !== ''} tip={loadingMessage}>
                <Space direction="vertical" size={24} className="full-width">
                    <Title level={1}>Links</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="space-between" align="bottom" className="filter-actions">
                        <Space direction="vertical" size={8} className="table-filter">
                            <Text strong>Filters</Text>
                            <Form.Item label="Name">
                                <Input
                                    placeholder="Enter Link Name"
                                    onChange={(e) => {
                                        filterLinksByName(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Category">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Category"
                                    onChange={(e) => {
                                        filterLinksByCategory(e);
                                    }}
                                    allowClear
                                    options={(linkCategories ?? []).map((lc) => ({ key: lc.linkCategoryId, label: lc.name, value: lc.linkCategoryId }))} />
                            </Form.Item>
                            <Form.Item label="Type">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Type"
                                    onChange={(e) => {
                                        filterLinksByType(e);
                                    }}
                                    allowClear
                                    options={[
                                        { label: 'Link', value: 1 },
                                        { label: 'Podcast', value: 2 },
                                        { label: 'Video', value: 3 },
                                    ]} />
                            </Form.Item>
                        </Space>

                        <Space direction="horizontal" size={16}>
                            <Button href="/links/categories">
                                Categories
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New Link
                            </Button>
                        </Space>
                    </Row>

                    <Table
                        columns={tableColumns}
                        dataSource={links}
                        rowKey="linkId"
                        pagination={{
                            pageSize: 25,
                        }}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <LinkForm
                link={linkToEdit ?? undefined}
                currentIssueNumber={links.length > 0 ? links[0]?.readingLogIssueNumber : undefined}
                open={showFormModal}
                onClose={() => {
                    setLinkToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadLinks();
                    setLinkToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default LinksHome;
