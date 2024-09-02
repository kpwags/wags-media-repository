"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./links/routes"));
const routes_2 = __importDefault(require("./podcasts/routes"));
const app = (0, express_1.default)();
const port = config_1.default.port || 3000;
const corsOptions = {
    origin: ['http://localhost:3009'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/links', routes_1.default);
app.use('/podcasts', routes_2.default);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
