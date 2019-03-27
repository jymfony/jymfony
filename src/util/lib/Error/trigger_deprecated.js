'use strict';

global.__jymfony = global.__jymfony || {};

__jymfony.trigger_deprecated = (message = '') => {
    process.emitWarning(message, 'DeprecationWarning');
};
