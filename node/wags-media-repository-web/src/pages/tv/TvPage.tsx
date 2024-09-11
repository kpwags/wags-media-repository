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
    Typography
} from 'antd';

import AppContext from '@contexts/AppContext';

import useVideoGenres from '@hooks/useVideoGenres';
import useVideoServices from '@hooks/useVideoServices';
import useDocumentTitle from '@hooks/useDocumentTitle';

import { Api } from '@lib/api';
import { TvStatus } from '@lib/constants';
import { getTvShowColumns } from '@lib/tvShowColumns';
import { sortByTitle } from '@lib/sorting';

import { TelevisionShow } from '@models/Tv';
import TvShowForm from '@components/tv/TvShowForm';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const TvPage = ({ status }: { status: TvStatus }): JSX.Element => {
    const [allTvShows, setAllTvShows] = useState<TelevisionShow[]>([]);
    const [tvShows, setTvShows] = useState<TelevisionShow[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ title: string, genreId: number, serviceId: number }>({ title: '', genreId: 0, serviceId: 0 });
    const [tvShowToEdit, setTvShowToEdit] = useState<TelevisionShow | undefined>(undefined);
    const [showFormModal, setShowFormModal] = useState<boolean>(false);

    const { setSidebarItem } = useContext(AppContext);

    const { videoGenres, error: genresError, isLoading: isGenresLoading } = useVideoGenres();
    const { videoServices, error: servicesError, isLoading: isServicesLoading } = useVideoServices();

    const screens = useBreakpoint();

    const loadingMessage = isGenresLoading || isServicesLoading ? 'Loading...' : processingMessage;
    const genresErrorMessage = genresError ? genresError.message : null;
    const servicesErrorMessage = servicesError ? servicesError.message : null;
    const errorMessage = genresErrorMessage || servicesErrorMessage || fetchError;
    const isLargeScreen = screens.lg || screens.xl || screens.xxl;

    const fetchTvShows = async (): Promise<[TelevisionShow[] | null, string | null]> => await await Api.Get<TelevisionShow[]>('tv');

    const loadTelevisionShows = useCallback(async () => {
        const [data, error] = await fetchTvShows();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        if (status === TvStatus.PersonalToWatch || status === TvStatus.JointToWatch) {
            setAllTvShows((data ?? []).filter((tv) => tv.statusId === status).sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)));
        } else {
            setAllTvShows((data ?? []).filter((tv) => tv.statusId === status).sort((a, b) => sortByTitle(a.title, b.title)) ?? []);
        }

        setProcessingMessage('');
    }, [status]);

    const deleteTelevisionShow = async (id: number) => {
        setProcessingMessage('Deleting TV show...');
        const [, error] = await Api.Delete(`tv/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadTelevisionShows();
    };

    const changeSidebar = useCallback(() => {
        switch (status) {
            case TvStatus.PersonalToWatch:
                setSidebarItem('tv-personal');
                break;

            case TvStatus.JointToWatch:
                setSidebarItem('tv-joint');
                break;

            case TvStatus.CurrentlyWatching:
                setSidebarItem('tv-watching');
                break;

            case TvStatus.InBetweenSeasons:
                setSidebarItem('tv-between');
                break;

            case TvStatus.Finished:
                setSidebarItem('tv-watched');
                break;

            case TvStatus.CouldNotFinish:
                setSidebarItem('tv-abandoned');
                break;

            default:
                break;
        }
    }, [setSidebarItem, status]);

    const filterMovieByTitle = (filterText: string) => {
        setActiveFilters({
            ...activeFilters,
            title: filterText.trim(),
        });
    };

    const filterMoviesByGenre = (genreId: number) => {
        setActiveFilters({
            ...activeFilters,
            genreId: genreId ?? 0,
        });
    };

    const filterMoviesByService = (serviceId: number) => {
        setActiveFilters({
            ...activeFilters,
            serviceId: serviceId ?? 0,
        });
    };

    useEffect(() => {
        loadTelevisionShows();
        changeSidebar();
    }, [loadTelevisionShows, changeSidebar]);

    useEffect(() => {
        if (activeFilters.genreId === 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() === '') {
            setTvShows(allTvShows);
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() !== '') {
            setTvShows(allTvShows.filter((m) => m.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
            return;
        }

        if (activeFilters.genreId > 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() === '') {
            setTvShows(allTvShows.filter((m) => m.genres.map((g) => g.videoGenreId).includes(activeFilters.genreId)));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.serviceId > 0 && activeFilters.title.trim() === '') {
            setTvShows(allTvShows.filter((m) => m.services.map((s) => s.videoServiceId).includes(activeFilters.serviceId)));
            return;
        }

        setTvShows(allTvShows.filter((m) => m.genres.map((g) => g.videoGenreId).includes(activeFilters.genreId)
            && m.services.map((s) => s.videoServiceId).includes(activeFilters.serviceId)
            && m.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
    }, [allTvShows, activeFilters]);

    const tableColumns = getTvShowColumns(
        status,
        isLargeScreen ?? false,
        (tvShow) => {
            setTvShowToEdit(tvShow);
            setShowFormModal(true);
        },
        (tvShowId) => deleteTelevisionShow(tvShowId)
    );

    const pageTitle = (): string => {
        switch (status) {
            case TvStatus.PersonalToWatch:
                return "TV Shows on My List";
            case TvStatus.JointToWatch:
                return "TV Shows on the Joint List";
            case TvStatus.CurrentlyWatching:
                return "TV Shows Currently Watching";
            case TvStatus.InBetweenSeasons:
                return "TV Shows Between Seasons";
            case TvStatus.Finished:
                return "TV Shows Finished";
            case TvStatus.CouldNotFinish:
                return "TV Shows I Could Not Finish";
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
                                    placeholder="Enter TV Show Title"
                                    onChange={(e) => {
                                        filterMovieByTitle(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <Form.Item label="Genre">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Genre"
                                    onChange={(e) => {
                                        filterMoviesByGenre(e);
                                    }}
                                    allowClear
                                    options={(videoGenres ?? []).map((vg) => ({ key: vg.videoGenreId, label: vg.name, value: vg.videoGenreId }))} />
                            </Form.Item>
                            <Form.Item label="Service">
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Select Service"
                                    onChange={(e) => {
                                        filterMoviesByService(e);
                                    }}
                                    allowClear
                                    options={(videoServices ?? []).map((vs) => ({ key: vs.videoServiceId, label: vs.name, value: vs.videoServiceId }))} />
                            </Form.Item>
                        </Space>

                        <Space direction="horizontal" size={16}>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={() => setShowFormModal(true)}
                            >
                                Add New TV Show
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={tvShows}
                        rowKey="televisionShowId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <TvShowForm
                tvShow={tvShowToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setTvShowToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadTelevisionShows();
                    setTvShowToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default TvPage;
