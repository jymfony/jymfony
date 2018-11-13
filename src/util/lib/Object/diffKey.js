'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {Array} arr1
 * @param {...Array} arrays
 *
 * @returns {Array|boolean}
 */
const diffKey = function (arr1, ...arrays) {
    const inArrays = key => {
        for (const array of arrays) {
            if (key in array) {
                return true;
            }
        }

        return false;
    };

    const retArr = {};
    for (const key of Object.keys(arr1)) {
        if (inArrays(key)) {
            continue;
        }

        retArr[key] = arr1[key];
    }

    return retArr;
};

__jymfony.diff_key = diffKey;
