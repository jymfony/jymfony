'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

__jymfony.trigger_deprecated = (message = '') => {
    process.emitWarning(message, 'DeprecationWarning');
};

// Suppress
function createWarningObject(warning, type, code, ctor, detail) {
    warning = new Error(warning);
    warning.name = String(type || 'Warning');
    if (code !== undefined) {
        warning.code = code;
    }
    if (detail !== undefined) {
        warning.detail = detail;
    }

    Error.captureStackTrace(warning, ctor || process.emitWarning);

    return warning;
}

/**
 * @returns {Jymfony.Component.Debug.ErrorHandler[]}
 */
function getErrorHandlers() {
    const errorHandlers = [];
    if (global.ReflectionClass === undefined) {
        return errorHandlers;
    }

    if (! ReflectionClass.exists('Jymfony.Component.Debug.ErrorHandler')) {
        return errorHandlers;
    }

    const warningListeners = process.listeners('warning');
    let handler;
    for (const listener of warningListeners) {
        if (!! listener.innerObject && (handler = listener.innerObject.getObject()) instanceof Jymfony.Component.Debug.ErrorHandler) {
            errorHandlers.push(handler);
        }
    }

    return errorHandlers;
}

process.emitWarning = function emitWarning(warning, type, code, ctor) {
    let detail;
    if (isObject(type)) {
        ctor = type.ctor;
        code = type.code;
        if ('string' === typeof type.detail) {
            detail = type.detail;
        }
        type = type.type || 'Warning';
    } else if (isFunction(type)) {
        ctor = type;
        code = undefined;
        type = 'Warning';
    }

    const warningObject = createWarningObject(warning, type, code, ctor, detail);
    const errorHandlers = getErrorHandlers();
    if ('DeprecationWarning' === type && 0 < errorHandlers.length) {
        for (const handler of errorHandlers) {
            handler.handleError(warningObject);
        }

        return;
    }

    process.emit('warning', warningObject);
};
