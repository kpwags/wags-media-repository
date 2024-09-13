import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import LinkRoutes from './links/routes';
import MovieRoutes from './movies/routes';
import PodcastRoutes from './podcasts/routes';
import SystemRoutes from './system/routes';
import TvRoutes from './tv/routes';
import VideoGameRoutes from './videoGames/routes';

const app = express();

const port = config.port || 3000;

const corsOptions = {
    origin: ['http://localhost:3009', 'https://192.168.1.232'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/link', LinkRoutes);
app.use('/movie', MovieRoutes);
app.use('/podcast', PodcastRoutes);
app.use('/system', SystemRoutes);
app.use('/tv', TvRoutes);
app.use('/video-game', VideoGameRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});