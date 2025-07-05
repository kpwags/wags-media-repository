import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import BookRoutes from './books/routes';
import { linkRouter } from '@routes/link';
import { movieRouter } from '@routes/movie';
import { musicRouter } from '@routes/music';
import { podcastRouter } from '@routes/podcast';
import SystemRoutes from './system/routes';
import TvRoutes from './tv/routes';
import VideoGameRoutes from './videoGames/routes';

const app = express();

const port = config.port || 3000;

const corsOptions = {
    origin: ['http://localhost:3009', 'http://192.168.1.152:3009', 'https://192.168.1.232'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/book', BookRoutes);
app.use('/link', linkRouter);
app.use('/movie', movieRouter);
app.use('/music', musicRouter);
app.use('/podcast', podcastRouter);
app.use('/system', SystemRoutes);
app.use('/tv', TvRoutes);
app.use('/video-game', VideoGameRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});