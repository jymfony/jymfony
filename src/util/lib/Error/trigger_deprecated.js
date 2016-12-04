global.__jymfony = global.__jymfony || {};

const util = require('util');

global.__jymfony.trigger_deprecated = function (message = '') {
    util.deprecate(() => {}, message)();
};
