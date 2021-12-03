'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

__jymfony.trigger_deprecated = (message = '') => {
    process.emitWarning(message, 'DeprecationWarning');
};
