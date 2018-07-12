const fs = require('fs');

/**
 * @param {string} file
 * @param {boolean} [followSymlink = false]
 *
 * @returns {Promise}
 */
function stat(file, followSymlink = false) {
    return new Promise((resolve, reject) => {
        fs[followSymlink ? 'stat' : 'lstat'](file, (err, stats) => {
            if (err) {
                if ('ENOENT' === err.code) {
                    resolve(false);
                }

                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}

module.exports = stat;
