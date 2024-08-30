"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config = require('./config.ts');
const dbRepo = require('./src/lib/Repository');
const app = (0, express_1.default)();
const port = config.port || 3000;
app.get('/podcasts', (_, res) => {
    dbRepo.Debug('SELECT * FROM Podcast');
    res.send('Hello');
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
