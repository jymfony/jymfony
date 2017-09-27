'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.sleep = function sleep(ms) {
    return new Promise(resolver => {
        setTimeout(resolver, ms);
    });
};
