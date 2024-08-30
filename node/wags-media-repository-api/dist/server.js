"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const PodcastRepository_1 = __importDefault(require("./lib/PodcastRepository"));
const app = (0, express_1.default)();
const port = config_1.default.port || 3000;
app.get('/podcasts', (_, res) => {
    PodcastRepository_1.default.GetAllPodcasts((podcasts) => res.json(podcasts));
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
