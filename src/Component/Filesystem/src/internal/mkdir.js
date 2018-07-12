const fs = require('fs');
const path = require('path');

/**
 * @param {string} path
 * @param {int} mode
 *
 * @returns {IterableIterator}
 */
const doMkdir = function doMkdir(path, mode) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, mode, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

/**
 * @param {string} dir
 * @param {int} mode
 *
 * @returns {IterableIterator}
 */
const mkdirRecursive = async function mkdirRecursive(dir, mode) {
    for (let i = 2; 0 < i; i--) {
        try {
            await doMkdir(dir, mode);
            break;
        } catch (e) {
            if ('ENOENT' !== e.code) {
                throw e;
            }

            await mkdirRecursive(path.dirname(dir), mode);
        }
    }
};

/**
 * @param {string} dir
 * @param {int} mode
 *
 * @returns {Promise}
 */
function mkdir(dir, mode) {
    return __jymfony.Async.run(mkdirRecursive(dir, mode));
}

module.exports = mkdir;
