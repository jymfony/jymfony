'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

__jymfony.sleep = function sleep(ms) {
    return new Promise(resolver => {
        setTimeout(resolver, ms);
    });
};
