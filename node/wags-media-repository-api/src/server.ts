import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import LinkRoutes from './links/routes';
import PodcastRoutes from './podcasts/routes';
import SystemRoutes from './system/routes';

const app = express();

const port = config.port || 3000;

const corsOptions = {
    origin: ['http://localhost:3009', 'https://192.168.1.232'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/links', LinkRoutes);
app.use('/podcasts', PodcastRoutes);
app.use('/system', SystemRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});