'use strict';

global.__jymfony = global.__jymfony || {};

let objectMerge = function (...args) {
    let retArray = args.every(T => isArray(T));

    if (retArray) {
        retArray = [];
        for (let arg of args) {
            retArray.concat(arg);
        }

        return retArray;
    }

    let counter = 0;
    let retObj = {};
    for (let arg of args) {
        for (let [k, v] of __jymfony.getEntries(arg)) {
            if (parseInt(k, 10) + '' === k) {
                retObj[counter++] = v;
            } else {
                retObj[k] = v;
            }
        }
    }

    return retObj;
};

global.__jymfony.objectMerge = objectMerge;
