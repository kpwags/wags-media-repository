import { useCallback, useContext, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Form,
    Input,
    Row,
    Select,
    Space,
    Spin,
    Table,
    TableProps,
    Typography
} from 'antd';

import AppContext from '@contexts/AppContext';

import useMusicGenres from '@hooks/useMusicGenres';

import { Api } from '@lib/api';
import { sortByTitle } from '@lib/sorting';

import Confirmation from '@components/base/Confirmation';
import AlbumForm from '@components/music/AlbumForm';
import TracksForm from '@components/music/TracksForm';

import { MusicAlbum } from '@models/Music';

const { Text, Title } = Typography;

const MusicHome = (): JSX.Element => {
    const [allMusicAlbums, setAllMusicAlbums] = useState<MusicAlbum[]>([]);
    const [musicAlbums, setMusicAlbums] = useState<MusicAlbum[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ title: string, genreId: number, formatId: number }>({ title: '', genreId: 0, formatId: 0 });
    const [musicAlbumToEdit, setMusicAlbumToEdit] = useState<MusicAlbum | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [showTracksFormModal, setShowTracksFormModal] = useState<boolean>(false);

    const { setSidebarItem } = useContext(AppContext);

    const { musicGenres, error, isLoading } = useMusicGenres();

    const loadingMessage = isLoading ? 'Loading...' : processingMessage;
    const errorMessage = error ? error.message : fetchError;

    const fetchAlbums = async (): Promise<[MusicAlbum[] | null, string | null]> => await await Api.Get<MusicAlbum[]>('music');

    const loadAlbums = useCallback(async () => {
        const [data, error] = await fetchAlbums();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        const sortedData = (data ?? []).sort((a, b) => sortByTitle(a.artist, b.artist) || sortByTitle(a.title, b.title));

        setMusicAlbums(sortedData);
        setAllMusicAlbums(sortedData);
        setProcessingMessage('');
    }, []);

    const deleteAlbum = async (id: number) => {
        setProcessingMessage('Deleting album...');
        const [, error] = await Api.Delete(`music/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadAlbums();
    };

    const filterAlbumsByTitle = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            title: filterText.trim(),
        });
    };

    const filterAlbumsByGenre = (genreId: number) => {
        setActiveFilters({
            ...activeFilters,
            genreId: genreId ?? 0,
        });
    };

    const filterAlbumsByFormat = (formatId: number) => {
        setActiveFilters({
            ...activeFilters,
            formatId: formatId ?? 0,
        });
    };

    useEffect(() => {
        loadAlbums();
        setSidebarItem('music');
    }, [loadAlbums, setSidebarItem]);

    useEffect(() => {
        if (activeFilters.genreId === 0 && activeFilters.formatId === 0 && activeFilters.title.trim() === '') {
            setMusicAlbums(allMusicAlbums);
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.formatId === 0 && activeFilters.title.trim() !== '') {
            setMusicAlbums(allMusicAlbums.filter((a) =>
                a.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())
                || a.artist.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())
            ));
            return;
        }

        if (activeFilters.genreId > 0 && activeFilters.formatId === 0 && activeFilters.title.trim() === '') {
            setMusicAlbums(allMusicAlbums.filter((a) => a.genres.map((g) => g.musicGenreId).includes(activeFilters.genreId)));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.formatId > 0 && activeFilters.title.trim() === '') {
            setMusicAlbums(allMusicAlbums.filter((a) => a.formats.map((f) => f.musicFormatId).includes(activeFilters.formatId)));
            return;
        }

        setMusicAlbums(allMusicAlbums.filter((a) => a.genres.map((g) => g.musicGenreId).includes(activeFilters.genreId)
            && a.formats.map((f) => f.musicFormatId).includes(activeFilters.formatId)
            && (
                a.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())
                || a.artist.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())
            )));
    }, [allMusicAlbums, activeFilters]);

    const tableColumns: TableProps<MusicAlbum>['columns'] = [
        {
            key: 'artist',
            title: 'Artist',
            dataIndex: 'artist',
            width: '40%',
            sorter: (a: MusicAlbum, b: MusicAlbum) => sortByTitle(a.artist, b.artist),
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            width: '40%',
            sorter: (a: MusicAlbum, b: MusicAlbum) => sortByTitle(a.title, b.title),
        },
        {
            key: 'actions',
            title: 'Actions',
            width: '15%',
            render: (_, album: MusicAlbum) => (
                <Space direction="horizontal" size={16}>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setMusicAlbumToEdit(album);
                            setShowFormModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        htmlType="button"
                        onClick={() => {
                            setMusicAlbumToEdit(album);
                            setShowTracksFormModal(true);
                        }}
                    >
                        Tracks
                    </Button>
                    <Confirmation
                        text={`Are you sure you want to delete '${album.title}'`}
                        onConfirm={() => deleteAlbum(album.musicAlbumId)}
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
                    <Title level={1}>Music</Title>
                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}
                    <Row justify="space-between" align="bottom" className="filter-actions">
                        <Space direction="vertical" size={8} className="table-filter">
                            <Text strong>Filters</Text>
                            <Form.Item label="Artist / Title">
                                <Input
                                    placeholder="Enter Title or Artist"
                                    onChange={(e) => {
                                        filterAlbumsByTitle(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Genre">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Genre"
                                    onChange={(e) => {
                                        filterAlbumsByGenre(e);
                                    }}
                                    allowClear
                                    options={(musicGenres ?? []).map((g) => ({ key: g.musicGenreId, label: g.name, value: g.musicGenreId }))}
                                />
                            </Form.Item>
                            <Form.Item label="Format">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Format"
                                    onChange={(e) => {
                                        filterAlbumsByFormat(e);
                                    }}
                                    allowClear
                                    options={[
                                        { key: 1, label: 'CD', value: 1 },
                                        { key: 2, label: 'Digital', value: 2 },
                                        { key: 3, label: 'Vinyl', value: 3 },
                                    ]}
                                />
                            </Form.Item>
                        </Space>
                        <Space direction="horizontal" size={16}>
                            <Button href="/#music/genres">
                                Genres
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New Album
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={musicAlbums}
                        rowKey="musicAlbumId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <AlbumForm
                album={musicAlbumToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setMusicAlbumToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadAlbums();
                    setMusicAlbumToEdit(undefined);
                    setShowFormModal(false);
                }}
            />

            <TracksForm
                album={musicAlbumToEdit ?? undefined}
                open={showTracksFormModal}
                onClose={() => {
                    setMusicAlbumToEdit(undefined);
                    setShowTracksFormModal(false);
                }}
                onSaved={() => {
                    loadAlbums();
                    setMusicAlbumToEdit(undefined);
                    setShowTracksFormModal(false);
                }}
            />
        </>
    );
}

export default MusicHome;
