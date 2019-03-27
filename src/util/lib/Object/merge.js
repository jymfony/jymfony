'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {...*} args
 *
 * @returns {Object}
 */
const objectMerge = (...args) => {
    let retArray = args.every(T => isArray(T));

    if (retArray) {
        retArray = [];
        for (const arg of args) {
            retArray.concat(arg);
        }

        return retArray;
    }

    let counter = 0;
    const retObj = {};
    for (const arg of args) {
        for (const [ k, v ] of __jymfony.getEntries(arg)) {
            if (parseInt(k, 10) + '' === k) {
                retObj[counter++] = v;
            } else {
                retObj[k] = v;
            }
        }
    }

    return retObj;
};

__jymfony.objectMerge = objectMerge;
