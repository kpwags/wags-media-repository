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
import { MovieStatus } from '@lib/constants';
import { getMovieTableColumns } from '@lib/movieColumns';
import { sortByDate } from '@lib/sorting';

import { Movie } from '@models/Movie';
import MovieForm from '@components/movies/MovieForm';
// import PodcastForm from '@components/podcasts/PodcastForm';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

const MoviesTable = ({ status }: { status: MovieStatus }): JSX.Element => {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [activeFilters, setActiveFilters] = useState<{ title: string, genreId: number, serviceId: number }>({ title: '', genreId: 0, serviceId: 0 });
    const [movieToEdit, setMovieToEdit] = useState<Movie | undefined>(undefined);
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

    const fetchMovies = async (): Promise<[Movie[] | null, string | null]> => await await Api.Get<Movie[]>('movie');

    const filterAndSortMovies = useCallback((data: Movie[]) => {
        if (status === MovieStatus.Watched || status === MovieStatus.CouldNotFinish) {
            const sorted = (data ?? [])
                .filter((m) => m.statusId === status)
                .sort((a, b) => sortByDate(a.dateWatched.toString(), b.dateWatched.toString()));

            setMovies(sorted);
            setAllMovies(sorted);
        } else {
            const sorted = (data ?? [])
                .filter((m) => m.statusId === status)
                .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));

            setMovies(sorted);
            setAllMovies(sorted);
        }
    }, [status]);

    const loadMovies = useCallback(async () => {
        const [data, error] = await fetchMovies();

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        filterAndSortMovies(data ?? []);
        setProcessingMessage('');
    }, [filterAndSortMovies]);

    const deleteMovie = async (id: number) => {
        setProcessingMessage('Deleting movie...');
        const [, error] = await Api.Delete(`movie/${id}`);

        if (error) {
            setFetchError(error);
            setProcessingMessage('');
            return;
        }

        await loadMovies();
    };

    const changeSidebar = useCallback(() => {
        switch (status) {
            case MovieStatus.PersonalToWatch:
                setSidebarItem('movies-personal');
                break;

            case MovieStatus.JointToWatch:
                setSidebarItem('movies-joint');
                break;


            case MovieStatus.Watched:
                setSidebarItem('movies-watched');
                break;


            case MovieStatus.CouldNotFinish:
                setSidebarItem('movies-abandoned');
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
        loadMovies();
        changeSidebar();
    }, [loadMovies, changeSidebar]);

    useEffect(() => {
        if (activeFilters.genreId === 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() === '') {
            setMovies(allMovies);
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() !== '') {
            setMovies(allMovies.filter((m) => m.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
            return;
        }

        if (activeFilters.genreId > 0 && activeFilters.serviceId === 0 && activeFilters.title.trim() === '') {
            setMovies(allMovies.filter((m) => m.genres.map((g) => g.videoGenreId).includes(activeFilters.genreId)));
            return;
        }

        if (activeFilters.genreId === 0 && activeFilters.serviceId > 0 && activeFilters.title.trim() === '') {
            setMovies(allMovies.filter((m) => m.services.map((s) => s.videoServiceId).includes(activeFilters.serviceId)));
            return;
        }

        setMovies(allMovies.filter((m) => m.genres.map((g) => g.videoGenreId).includes(activeFilters.genreId)
            && m.services.map((s) => s.videoServiceId).includes(activeFilters.serviceId)
            && m.title.toLocaleLowerCase().includes(activeFilters.title.toLocaleLowerCase())));
    }, [allMovies, activeFilters]);

    const tableColumns = getMovieTableColumns(
        status,
        isLargeScreen ?? false,
        (movie) => {
            setMovieToEdit(movie);
            setShowFormModal(true);
        },
        (movieId) => deleteMovie(movieId)
    );

    const pageTitle = (): string => {
        switch (status) {
            case MovieStatus.PersonalToWatch:
                return "Movies on My List";
            case MovieStatus.JointToWatch:
                return "Movies on the Joint List";
            case MovieStatus.Watched:
                return "Movies Watched";
            case MovieStatus.CouldNotFinish:
                return "Movies I Could Not Finish";
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
                                    placeholder="Enter Movie Title"
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
                                Add New Movie
                            </Button>
                        </Space>
                    </Row>
                    <Table
                        columns={tableColumns}
                        dataSource={movies}
                        rowKey="movieId"
                        pagination={false}
                        loading={loadingMessage !== ''}
                    />
                </Space>
            </Spin>

            <MovieForm
                movie={movieToEdit ?? undefined}
                open={showFormModal}
                onClose={() => {
                    setMovieToEdit(undefined);
                    setShowFormModal(false);
                }}
                onSaved={() => {
                    loadMovies();
                    setMovieToEdit(undefined);
                    setShowFormModal(false);
                }}
            />
        </>
    );
}

export default MoviesTable;
