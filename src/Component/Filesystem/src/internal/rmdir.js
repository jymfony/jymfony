const fs = require('fs');

/**
 * @param {string} file
 *
 * @returns {Promise}
 */
function rmdir(file) {
    return new Promise((resolve, reject) => {
        fs.rmdir(file, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = rmdir;
