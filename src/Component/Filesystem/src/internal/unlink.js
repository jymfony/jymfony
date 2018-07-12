const fs = require('fs');

/**
 * @param {string} file
 *
 * @returns {Promise}
 */
module.exports = function unlink(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
