const fs = require('fs');

/**
 * @param {string} path
 *
 * @returns {Promise}
 */
function readdir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, {}, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

module.exports = readdir;
