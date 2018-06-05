const fs = require('fs');
const path = require('path');

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

module.exports = function mkdir (dir, mode) {
    return __jymfony.Async.run(mkdirRecursive(dir, mode));
};
