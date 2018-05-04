const fs = require('fs');

/**
 * @param {string} file
 *
 * @returns {Promise}
 */
function realpath(file) {
    return new Promise((resolve, reject) => {
        fs.realpath(file, {}, (err, resolvedPath) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(resolvedPath);
        });
    });
}

module.exports = realpath;
