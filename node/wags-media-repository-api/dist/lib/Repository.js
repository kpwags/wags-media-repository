"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const config_1 = __importDefault(require("../config"));
class Repository {
}
Repository.Debug = (query) => {
    const db = new sqlite3_1.default.Database(config_1.default.db);
    db.each(query, (err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log({ row });
    });
};
exports.default = Repository;
