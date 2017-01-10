'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.getFunction = function (object, funcName) {
    if (isFunction(object.constructor[funcName])) {
        return object.constructor[funcName];
    }

    if (isFunction(object[funcName])) {
        return object[funcName];
    }

    throw new RuntimeException(`Cannot retrieve function ${funcName} from ${object.constructor.name}`);
};
