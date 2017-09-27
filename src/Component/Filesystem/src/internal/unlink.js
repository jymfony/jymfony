const fs = require('fs');

module.exports = function unlink (file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
