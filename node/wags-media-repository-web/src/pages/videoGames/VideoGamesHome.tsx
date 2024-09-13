import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Typography
} from 'antd';

import AppContext from '@contexts/AppContext';

import useVideoGameGenres from '@hooks/useVideoGameGenres';
import useVideoGameSystems from '@hooks/useVideoGameSystems';
import useDocumentTitle from '@hooks/useDocumentTitle';

import { Api } from '@lib/api';
import { VideoGameStatus } from '@lib/constants';
import { sortByDate, sortByTitle } from '@lib/sorting';

import { VideoGameColumns } from '@components/videoGames/VideoGameColumns';
import VideoGameForm from '@components/videoGames/VideoGameForm';

import { VideoGame } from '@models/VideoGame';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const VideoGamesHome = ({ status }: { status: VideoGameStatus }): JSX.Element => {
    const [allVideoGames, setAllVideoGames] = useState<VideoGame[]>([]);
    const [videoGames, setVideoGames] = useState<VideoGame[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ title: string, genreId: number, systemId: number }>({ title: '', genreId: 0, systemId: 0 });
    const [videoGameToEdit, setVideoGameToEdit] = useState<VideoGame | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const { setSidebarItem } = useContext(AppContext);

    const { videoGameGenres, error: genresError, isLoading: isGenresLoading } = useVideoGameGenres();
    const { videoGameSystems, error: systemsError, isLoading: isSystemsLoading } = useVideoGameSystems();

    const screens = useBreakpoint();
    const navigate = useNavigate();

    const loadingMessage = isGenresLoading || isSystemsLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = systemsError ? systemsError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || fetchError;
    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    const fetchVideoGames = async (): Promise<[VideoGame[] | null, string | null]> => await await Api.Get<VideoGame[]>('video-game');

    const loadVideoGames = useCallback(async () => {
        const [data, error] = await fetchVideoGames();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        if (status === VideoGameStatus.ToPlay) {
            setAllVideoGames((data ?? []).filter((game) => game.videoGameStatusId === status).sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)));
        } else if (status === VideoGameStatus.InProgress) {
            setAllVideoGames((data ?? []).filter((game) => game.videoGameStatusId === status).sort((a, b) => sortByTitle(a.title, b.title)) ?? []);
        } else {
            setAllVideoGames((data ?? []).filter((game) => game.videoGameStatusId === status).sort((a, b) => sortByDate((a?.dateCompleted ?? new Date(1900, 0, 1)).toString(), (b?.dateCompleted ?? new Date(1900, 0, 1)).toString())) ?? []);
        }

        setProcessingMessage('');
    }, [status]);

    const deleteVidegame = async (id: number) => {
        setProcessingMessage('Deleting Video Game...');
        const [, error] = await Api.Delete(`video-game/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadVideoGames();
    };

    const changeSidebar = useCallback(() => {
        switch (status) {
            case VideoGameStatus.ToPlay:
                setSidebarItem('video-games-playing');
                break;

            case VideoGameStatus.Completed:
                setSidebarItem('video-games-finished');
                break;

            case VideoGameStatus.InProgress:
                setSidebarItem('video-games-playing');
                break;

            default:
                break;
        }
    }, [setSidebarItem, status]);

    const filterVideoGamesByTitle = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            title: filterText.trim(),
        });
    };

    const filterVideoGamesByGenre = (genreId: number) => {
        setActiveFilters({
            ...activeFilters,
            genreId: genreId ?? 0,
        });
    };

    const filterVideoGamesBySystem = (systemId: number) => {
        setActiveFilters({
            ...activeFilters,
            systemId: systemId ?? 0,
        });
    };

    useEffect(() => {
        loadVideoGames();
        changeSidebar();
    }, [loadVideoGames, changeSidebar]);

    useEffect(() => {
        if (activeFilters.genreId === 0 && activeFilters.systemId === 0 && activeFilters.title.trim() === '') {
            setVideoGames(allVideoGames);
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.systemId === 0 && activeFilters.title.trim() !== '') {
            setVideoGames(allVideoGames.filter((vg) => vg.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
            return;
        }

        if (activeFilters.genreId > 0 && activeFilters.systemId === 0 && activeFilters.title.trim() === '') {
            setVideoGames(allVideoGames.filter((vg) => vg.genres.map((g) => g.videoGameGenreId).includes(activeFilters.genreId)));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.systemId > 0 && activeFilters.title.trim() === '') {
            setVideoGames(allVideoGames.filter((vg) => vg.systems.map((s) => s.videoGameSystemId).includes(activeFilters.systemId)));
            return;
        }

        setVideoGames(allVideoGames.filter((vg) => vg.genres.map((g) => g.videoGameGenreId).includes(activeFilters.genreId)
            && vg.systems.map((s) => s.videoGameSystemId).includes(activeFilters.systemId)
            && vg.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
    }, [allVideoGames, activeFilters]);

    const tableColumns = VideoGameColumns(
        status,
        isLargeScreen ?? false,
        (tvShow) => {
            setVideoGameToEdit(tvShow);
            setShowFormModal(true);
        },
        (videoGameId) => deleteVidegame(videoGameId)
    );

    const pageTitle = (): string => {
        switch (status) {
            case VideoGameStatus.ToPlay:
                return 'Video Game Backlog';
            case VideoGameStatus.InProgress:
                return 'Video Games In Progress';
            case VideoGameStatus.Completed:
                return 'Video Games Finished'
            default:
                return "How the hell did you get here?";
        }
    };

    useDocumentTitle(pageTitle());

    return (
        <>
            <Spin spinning={loadingMessage !== ''} tip={loadingMessage}>
                <Space direction="vertical" size={24} className="full-width">
                    <Title level={1}>{pageTitle()}</Title>

                    {errorMessage !== '' ? <Alert type="error" message={errorMessage} /> : null}

                    <Row justify="space-between" align="bottom" className="filter-actions">
                        <Space direction="vertical" size={8} className="table-filter">
                            <Text strong>Filters</Text>
                            <Form.Item label="Title">
                                <Input
                                    placeholder="Enter Title"
                                    onChange={(e) => {
                                        filterVideoGamesByTitle(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Genre">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Genre"
                                    onChange={(e) => {
                                        filterVideoGamesByGenre(e);
                                    }}
                                    allowClear
                                    options={(videoGameGenres ?? []).map((vg) => ({ key: vg.videoGameGenreId, label: vg.name, value: vg.videoGameGenreId }))} />
                            </Form.Item>
                            <Form.Item label="System">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select System"
                                    onChange={(e) => {
                                        filterVideoGamesBySystem(e);
                                    }}
                                    allowClear
                                    options={(videoGameSystems ?? []).map((vs) => ({ key: vs.videoGameSystemId, label: vs.name, value: vs.videoGameSystemId }))} />
                            </Form.Item>
                        </Space>

                        <Space direction="horizontal" size={16}>
                            <Button onClick={() => navigate('/video-games/genres')}>
                                Genres
                            </Button>
                            <Button onClick={() => navigate('/video-games/systems')}>
                                Systems
                            </Button>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New Video Game
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={videoGames}
                        rowKey="videoGameId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <VideoGameForm
                videoGame={videoGameToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setVideoGameToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadVideoGames();
                    setVideoGameToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default VideoGamesHome;
