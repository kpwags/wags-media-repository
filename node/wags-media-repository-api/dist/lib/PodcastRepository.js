"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = __importDefault(require("../config"));
const podcast_1 = require("../queries/podcast");
class PodcastRepository {
}
_a = PodcastRepository;
PodcastRepository.GetDatabase = () => new sqlite3_1.default.Database(config_1.default.db);
PodcastRepository.GetAllPodcasts = (callback) => {
    const db = _a.GetDatabase();
    const podcasts = [];
    db.all(podcast_1.listPodcasts, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log({ podcastCount: rows.length });
        rows.forEach((row) => {
            podcasts.push({
                podcastId: row.PodcastId,
                podcastCategoryId: row.PodcastCategoryId,
                name: row.Name,
                link: row.Link,
                coverImageUrl: row.CoverImageUrl,
                category: {
                    podcastCategoryId: row.PodcastCategoryId,
                    name: row.PodcastCategoryName,
                    colorCode: row.ColorCode,
                }
            });
        });
        console.log({ podcastCount: podcasts.length });
    }, () => callback(podcasts));
};
exports.default = PodcastRepository;
