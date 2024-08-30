import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom';

import PageLayout from '@components/base/PageLayout';
import AppContainer from '@components/base/AppContainer';

import PodcastsHome from '@pages/PodcastsHome';

const Router = (): JSX.Element => (
    <BrowserRouter>
        <AppContainer>
            <PageLayout>
                <Routes>
                    <Route path="/podcasts" element={<PodcastsHome />} />
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