const fs = require('fs');

module.exports = function readdir (path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, {}, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};
