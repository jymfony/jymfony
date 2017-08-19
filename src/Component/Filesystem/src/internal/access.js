const fs = require('fs');

module.exports = function access (filename, mode) {
    return new Promise(resolve => {
        fs.access(filename, mode, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};
