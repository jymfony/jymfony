const fs = require('fs');

/**
 * @param {string} file
 *
 * @returns {Promise}
 */
function readlink(file) {
    return new Promise((resolve, reject) => {
        fs.readlink(file, {}, (err, linkString) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(linkString);
        });
    });
}

module.exports = readlink;
