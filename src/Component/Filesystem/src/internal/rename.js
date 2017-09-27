const fs = require('fs');

module.exports = function rename (origin, target) {
    return new Promise((resolve, reject) => {
        fs.rename(origin, target, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
