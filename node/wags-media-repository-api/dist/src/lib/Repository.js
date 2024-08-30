"use strict";
const sqlite3 = require('sqlite3').verbose();
const config = require('../../config.ts');
class Repository {
}
Repository.Debug = (query) => {
    const db = new sqlite3.Database(config.db);
    db.each(query, (err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log({ row });
    });
};
module.exports = Repository;
