import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import { MovieStatus } from '@lib/constants';

import PageLayout from '@components/base/PageLayout';
import AppContainer from '@components/base/AppContainer';

import LinksHome from '@pages/links/LinksHome';
import LinkCategories from '@pages/links/LinkCategories';

import MoviesTable from '@pages/movies/MoviesTable';

import PodcastsHome from '@pages/podcasts/PodcastsHome';
import PodcastCategories from '@pages/podcasts/PodcastCategories';

import VideoServices from '@pages/system/VideoServices';
import VideoGenres from '@pages/system/VideoGenres';

const Router = (): JSX.Element => (
    <BrowserRouter>
        <AppContainer>
            <PageLayout>
                <Routes>
                    <Route path="/links" element={<LinksHome />} />
                    <Route path="/links/categories" element={<LinkCategories />} />
                    <Route path="/movies/personal" element={<MoviesTable status={MovieStatus.PersonalToWatch} />} />
                    <Route path="/movies/joint" element={<MoviesTable status={MovieStatus.JointToWatch} />} />
                    <Route path="/movies/watched" element={<MoviesTable status={MovieStatus.Watched} />} />
                    <Route path="/podcasts/categories" element={<PodcastCategories />} />
                    <Route path="/podcasts" element={<PodcastsHome />} />loadGenres
                    <Route path="/system/video-genres" element={<VideoGenres />} />
                    <Route path="/system/video-services" element={<VideoServices />} />
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