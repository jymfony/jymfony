'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * @param {...*} args
 *
 * @returns {Object}
 */
const deepMerge = (...args) => {
    if (2 === args.length) {
        if ((! isArray(args[0]) && ! isObjectLiteral(args[0])) || (! isArray(args[1]) && ! isObjectLiteral(args[1]))) {
            return args[1];
        }
    }

    const retArray = args.every(T => isArray(T));

    const retObj = retArray ? [] : {};
    for (const arg of args) {
        for (const [ k, v ] of __jymfony.getEntries(arg)) {
            retObj[k] = deepMerge(retObj[k], v);
        }
    }

    return retObj;
};

__jymfony.deepMerge = deepMerge;
