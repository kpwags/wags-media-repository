import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import { bookRouter } from '@routes/book';
import { linkRouter } from '@routes/link';
import { movieRouter } from '@routes/movie';
import { musicRouter } from '@routes/music';
import { podcastRouter } from '@routes/podcast';
import { systemRouter } from '@routes/system';
import { tvRouter } from '@routes/tv';
import { videoGameRouter } from '@routes/videoGame';

const app = express();

const port = config.port || 3000;

const corsOptions = {
	origin: config.cors,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/book', bookRouter);
app.use('/link', linkRouter);
app.use('/movie', movieRouter);
app.use('/music', musicRouter);
app.use('/podcast', podcastRouter);
app.use('/system', systemRouter);
app.use('/tv', tvRouter);
app.use('/video-game', videoGameRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});