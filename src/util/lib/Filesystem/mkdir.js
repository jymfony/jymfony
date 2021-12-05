'use strict';

const fs = require('fs');
const path = require('path');

globalThis.__jymfony = globalThis.__jymfony || {};

__jymfony.mkdir = function mkdir (dir, mode = 0o777) {
    for (let i = 2; 0 < i; i--) {
        try {
            fs.mkdirSync(dir, mode);
            break;
        } catch (e) {
            if ('ENOENT' !== e.code) {
                throw e;
            }

            mkdir(path.dirname(dir), mode);
        }
    }
};
