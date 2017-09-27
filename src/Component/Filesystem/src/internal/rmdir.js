const fs = require('fs');

module.exports = function rmdir (file) {
    return new Promise((resolve, reject) => {
        fs.rmdir(file, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
