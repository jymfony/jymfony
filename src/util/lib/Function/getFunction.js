'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

__jymfony.getFunction = (object, funcName) => {
    if (isFunction(object.constructor[funcName])) {
        return object.constructor[funcName];
    }

    if (isFunction(object[funcName])) {
        return new BoundFunction(object, object[funcName]);
    }

    throw new RuntimeException(`Cannot retrieve function ${funcName} from ${object.constructor.name}`);
};
