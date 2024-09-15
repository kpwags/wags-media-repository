import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import { BookStatus, MovieStatus, TvStatus, VideoGameStatus } from '@lib/constants';

import PageLayout from '@components/base/PageLayout';
import AppContainer from '@components/base/AppContainer';

import BooksHome from '@pages/books/BooksHome';
import BookGenres from '@pages/books/BookGenres';
import BookSeries from '@pages/books/BookSeries';

import LinksHome from '@pages/links/LinksHome';
import LinkCategories from '@pages/links/LinkCategories';

import MoviesTable from '@pages/movies/MoviesTable';

import PodcastsHome from '@pages/podcasts/PodcastsHome';
import PodcastCategories from '@pages/podcasts/PodcastCategories';

import TvPage from '@pages/tv/TvPage';

import VideoServices from '@pages/system/VideoServices';
import VideoGenres from '@pages/system/VideoGenres';

import VideoGamesHome from '@pages/videoGames/VideoGamesHome';
import VideoGameGenres from '@pages/videoGames/VideoGameGenres';
import VideoGameSystems from '@pages/videoGames/VideoGameSystems';

const Router = (): JSX.Element => (
    <BrowserRouter>
        <AppContainer>
            <PageLayout>
                <Routes>
                    <Route path="/books/backlog" element={<BooksHome status={BookStatus.ToRead} />} />
                    <Route path="/books/current" element={<BooksHome status={BookStatus.CurrentlyReading} />} />
                    <Route path="/books/finished" element={<BooksHome status={BookStatus.Finished} />} />
                    <Route path="/books/abandoned" element={<BooksHome status={BookStatus.Abandoned} />} />
                    <Route path="/books/genres" element={<BookGenres />} />
                    <Route path="/books/series" element={<BookSeries />} />

                    <Route path="/links" element={<LinksHome />} />
                    <Route path="/links/categories" element={<LinkCategories />} />

                    <Route path="/movies/personal" element={<MoviesTable status={MovieStatus.PersonalToWatch} />} />
                    <Route path="/movies/joint" element={<MoviesTable status={MovieStatus.JointToWatch} />} />
                    <Route path="/movies/watched" element={<MoviesTable status={MovieStatus.Watched} />} />
                    <Route path="/movies/abandoned" element={<MoviesTable status={MovieStatus.CouldNotFinish} />} />

                    <Route path="/podcasts/categories" element={<PodcastCategories />} />
                    <Route path="/podcasts" element={<PodcastsHome />} />loadGenres

                    <Route path="/system/video-genres" element={<VideoGenres />} />
                    <Route path="/system/video-services" element={<VideoServices />} />

                    <Route path="/tv/personal" element={<TvPage status={TvStatus.PersonalToWatch} />} />
                    <Route path="/tv/joint" element={<TvPage status={TvStatus.JointToWatch} />} />
                    <Route path="/tv/watching" element={<TvPage status={TvStatus.CurrentlyWatching} />} />
                    <Route path="/tv/between-seasons" element={<TvPage status={TvStatus.InBetweenSeasons} />} />
                    <Route path="/tv/watched" element={<TvPage status={TvStatus.Finished} />} />
                    <Route path="/tv/abandoned" element={<TvPage status={TvStatus.CouldNotFinish} />} />

                    <Route path="/video-games/backlog" element={<VideoGamesHome status={VideoGameStatus.ToPlay} />} />
                    <Route path="/video-games/playing" element={<VideoGamesHome status={VideoGameStatus.InProgress} />} />
                    <Route path="/video-games/finished" element={<VideoGamesHome status={VideoGameStatus.Completed} />} />
                    <Route path="/video-games/genres" element={<VideoGameGenres />} />
                    <Route path="/video-games/systems" element={<VideoGameSystems />} />

                    <Route
                        path="*"
                        element={<h1>Hello</h1>}
                    />
                </Routes>
            </PageLayout>
        </AppContainer>
    </BrowserRouter>
);

export default Router;