import {
    Fragment,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    Alert,
    Col,
    Divider,
    Empty,
    List,
    Row,
    Space,
    Spin,
    Typography,
} from 'antd';

import VideoCameraOutlined from '@ant-design/icons/lib/icons/VideoCameraOutlined';
import ReadOutlined from '@ant-design/icons/lib/icons/ReadOutlined';
import LinkOutlined from '@ant-design/icons/lib/icons/LinkOutlined';
import DesktopOutlined from '@ant-design/icons/lib/icons/DesktopOutlined';
import RocketOutlined from '@ant-design/icons/lib/icons/RocketOutlined';
import CustomerServiceOutlined from '@ant-design/icons/lib/icons/CustomerServiceOutlined';

import AppContext from '@contexts/AppContext';

import { Api } from '@lib/api';
import { sortByTitle } from '@lib/sorting';

import DashboardBook from '@components/books/DashboardBook';
import DashboardTelevisionShow from '@components/tv/DashboardTelevisionShow';
import DashboardVideoGame from '@components/videoGames/DashboardVideoGame';
import DashboardMusic from '@pages/music/DashboardMusic';
import DashboardMovie from '@components/movies/DashboardMovie';

import { Book } from '@models/Book';
import { Movie } from '@models/Movie';
import { TelevisionShow } from '@models/Tv';
import { Link } from '@models/Link';
import { VideoGame } from '@models/VideoGame';
import { MusicAlbum } from '@models/Music';
import UpdateBookProgressForm from '@components/books/UpdateBookProgressForm';
import UpdateTelevisionShowProgressForm from '@components/tv/UpdateTelevisionShowProgressForm';

const Dashboard = (): JSX.Element => {
    const [processingMessage, setProcessingMessage] = useState<string>('Loading...');
    const [fetchError, setFetchError] = useState<string>('');
    const [currentBooks, setCurrentBooks] = useState<Book[]>([]);
    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
    const [currentTvShows, setCurrentTvShows] = useState<TelevisionShow[]>([]);
    const [recentLinks, setRecentLinks] = useState<Link[]>([]);
    const [currentVideoGames, setCurrentVideoGames] = useState<VideoGame[]>([]);
    const [currentMusic, setCurrentMusic] = useState<MusicAlbum[]>([]);

    const [bookToUpdateProgress, setBookToUpdateProgress] = useState<Book | undefined>(undefined);
    const [tvShowToUpdateProgress, setTvShowToUpdateProgress] = useState<TelevisionShow | undefined>(undefined);

    const { setSidebarItem } = useContext(AppContext);

    const loadCurrentBooks = async (clearProcessingMessage = false) => {
        const [data, error] = await Api.Get<Book[]>('book/current');

        if (error) {
            setFetchError(error);
            return;
        }

        setCurrentBooks((data ?? []).sort((a, b) => sortByTitle(a.title, b.title)));

        if (clearProcessingMessage) {
            setProcessingMessage('');
        }
    };

    const loadRecentBooks = async () => {
        const [data, error] = await Api.Get<Book[]>('book/recent/30');

        if (error) {
            setFetchError(error);
            return;
        }

        setRecentBooks(data ?? []);
    };

    const loadRecentMovies = async () => {
        const [data, error] = await Api.Get<Movie[]>('movie/recent/30');

        if (error) {
            setFetchError(error);
            return;
        }

        setRecentMovies(data ?? []);
    };

    const loadCurrentTelevision = async (clearProcessingMessage = false) => {
        const [data, error] = await Api.Get<TelevisionShow[]>('tv/current');

        if (error) {
            setFetchError(error);
            return;
        }

        setCurrentTvShows((data ?? []).sort((a, b) => sortByTitle(a.title, b.title)));

        if (clearProcessingMessage) {
            setProcessingMessage('');
        }
    };

    const loadRecentLinks = async () => {
        const [data, error] = await await Api.Get<Link[]>('link');

        if (error) {
            setFetchError(error);
            return;
        }

        setRecentLinks((data ?? []).slice(0, 5));
    };

    const loadCurrentVideoGames = async () => {
        const [data, error] = await Api.Get<VideoGame[]>('video-game/current');

        if (error) {
            setFetchError(error);
            return;
        }

        setCurrentVideoGames((data ?? []).sort((a, b) => sortByTitle(a.title, b.title)));
    };

    const loadCurrentMusic = async () => {
        const [data, error] = await Api.Get<MusicAlbum[]>('music/now');

        if (error) {
            setFetchError(error);
            return;
        }

        setCurrentMusic((data ?? []).sort((a, b) => sortByTitle(a.title, b.title)));
    };

    const loadData = useCallback(async () => {
        await Promise.all([
            loadCurrentBooks(),
            loadRecentBooks(),
            loadRecentMovies(),
            loadCurrentTelevision(),
            loadRecentLinks(),
            loadCurrentVideoGames(),
            loadCurrentMusic(),
        ]);

        setProcessingMessage('');
    }, []);

    useEffect(() => {
        setSidebarItem('home');
        loadData();
    }, [loadData, setSidebarItem]);

    return (
        <>
            <Spin spinning={processingMessage !== ''} tip={processingMessage}>
                {fetchError !== '' ? <Alert type="error" message={fetchError} /> : null}

                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <div className="dashboard-section">
                            <div className="title">Currently Reading</div>
                            <div className="content">
                                {currentBooks.length > 0 ? (
                                    <Space direction="vertical" size={16}>
                                        {currentBooks.map((b, idx) => (
                                            <Fragment key={b.bookId}>
                                                <DashboardBook
                                                    mode="current"
                                                    book={b}
                                                    onUpdateProgress={(book) => setBookToUpdateProgress(book)}
                                                />
                                                {(idx + 1) < currentBooks.length ? <Divider /> : null}
                                            </Fragment>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<ReadOutlined />}
                                        description="No Current Books"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="title">Currently Watching</div>
                            <div className="content">
                                {currentTvShows.length > 0 ? (
                                    <Space direction="vertical" size={16}>
                                        {currentTvShows.map((t, idx) => (
                                            <Fragment key={t.televisionShowId}>
                                                <DashboardTelevisionShow
                                                    tvShow={t}
                                                    onUpdateProgress={(tvShow) => setTvShowToUpdateProgress(tvShow)}
                                                />
                                                {(idx + 1) < currentTvShows.length ? <Divider /> : null}
                                            </Fragment>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<DesktopOutlined />}
                                        description="No Current TV Shows"
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="dashboard-section">
                            <div className="title">Currently Playing</div>
                            <div className="content">
                                {currentVideoGames.length > 0 ? (
                                    <Space direction="horizontal" size={16} wrap align="start">
                                        {currentVideoGames.map((g) => (
                                            <DashboardVideoGame key={g.videoGameId} game={g} />
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<RocketOutlined />}
                                        description="No Current Video Games"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="title">Currently Listening To</div>
                            <div className="content">
                                {currentMusic.length > 0 ? (
                                    <Space direction="horizontal" size={16} wrap align="start">
                                        {currentMusic.map((a) => (
                                            <DashboardMusic key={a.musicAlbumId} album={a} />
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<CustomerServiceOutlined />}
                                        description="No Current Music"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="title">Recently Read</div>
                            <div className="content">
                                {recentBooks.length > 0 ? (
                                    <Space direction="vertical" size={16}>
                                        {recentBooks.map((b, idx) => (
                                            <Fragment key={b.bookId}>
                                                <DashboardBook
                                                    mode="recent"
                                                    book={b}
                                                />
                                                {(idx + 1) < recentBooks.length ? <Divider /> : null}
                                            </Fragment>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<ReadOutlined />}
                                        description="No Recently Read Books"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="title">Recently Watched</div>
                            <div className="content">
                                {recentMovies.length > 0 ? (
                                    <Space direction="vertical" size={16}>
                                        {recentMovies.map((m, idx) => (
                                            <Fragment key={m.movieId}>
                                                <DashboardMovie movie={m} />
                                                {(idx + 1) < recentMovies.length ? <Divider /> : null}
                                            </Fragment>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty
                                        image={<VideoCameraOutlined />}
                                        description="No Recently Watched Movies"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="dashboard-section">
                            <div className="title">Recent Links</div>
                            <div>
                                {recentLinks.length > 0 ? (
                                    <List
                                        bordered={false}
                                        dataSource={recentLinks}
                                        renderItem={(item) => (
                                            <List.Item>
                                                <Typography.Link
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                >
                                                    {item.title}
                                                </Typography.Link>
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Empty
                                        image={<LinkOutlined />}
                                        description="No Recent Links"
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Spin>

            <UpdateBookProgressForm
                book={bookToUpdateProgress}
                open={bookToUpdateProgress !== undefined}
                onClose={() => setBookToUpdateProgress(undefined)}
                onSaved={() => {
                    setProcessingMessage('Refreshing Books...');
                    loadCurrentBooks(true);
                    setBookToUpdateProgress(undefined);
                }}
            />

            <UpdateTelevisionShowProgressForm
                tvShow={tvShowToUpdateProgress}
                open={tvShowToUpdateProgress !== undefined}
                onClose={() => setTvShowToUpdateProgress(undefined)}
                onSaved={() => {
                    setProcessingMessage('Refreshing TV Shows...');
                    loadCurrentTelevision(true);
                    setTvShowToUpdateProgress(undefined);
                }}
            />
        </>
    );
};

export default Dashboard;
