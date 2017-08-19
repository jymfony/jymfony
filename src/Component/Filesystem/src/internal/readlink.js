const fs = require("fs");

module.exports = function readlink (file) {
    return new Promise((resolve, reject) => {
        fs.readlink(file, {}, (err, linkString) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(linkString);
        });
    });
};
