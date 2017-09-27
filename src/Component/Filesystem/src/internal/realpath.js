const fs = require('fs');

module.exports = function realpath (file) {
    return new Promise((resolve, reject) => {
        fs.realpath(file, {}, (err, resolvedPath) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(resolvedPath);
        });
    });
};
