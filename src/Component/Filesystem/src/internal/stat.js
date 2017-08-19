const fs = require('fs');

module.exports = function stat (file, followSymlink = false) {
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
};
