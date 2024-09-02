import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import PageLayout from '@components/base/PageLayout';
import AppContainer from '@components/base/AppContainer';

import LinksHome from '@pages/links/LinksHome';
import LinkCategories from '@pages/links/LinkCategories';
import PodcastsHome from '@pages/podcasts/PodcastsHome';
import PodcastCategories from '@pages/podcasts/PodcastCategories';
import VideoServices from '@pages/system/VideoServices';

const Router = (): JSX.Element => (
    <BrowserRouter>
        <AppContainer>
            <PageLayout>
                <Routes>
                    <Route path="/links" element={<LinksHome />} />
                    <Route path="/links/categories" element={<LinkCategories />} />
                    <Route path="/podcasts/categories" element={<PodcastCategories />} />
                    <Route path="/podcasts" element={<PodcastsHome />} />
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