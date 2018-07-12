const fs = require('fs');

/**
 * @param {string} origin
 * @param {string} target
 *
 * @returns {Promise}
 */
function rename(origin, target) {
    return new Promise((resolve, reject) => {
        fs.rename(origin, target, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = rename;
