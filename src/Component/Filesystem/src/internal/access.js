const fs = require('fs');

/**
 * @param {string} filename
 * @param {int} mode
 *
 * @returns {Promise}
 */
function access(filename, mode) {
    return new Promise(resolve => {
        fs.access(filename, mode, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

module.exports = access;
