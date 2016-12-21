'use strict';

global.__jymfony = global.__jymfony || {};

let diffKey = function (arr1, ...arrays) {
    let inArrays = key => {
        for (let array of arrays) {
            if (key in array) {
                return true;
            }
        }

        return false;
    };

    let retArr = {};
    for (let key of Object.keys(arr1)) {
        if (inArrays(key)) {
            continue;
        }

        retArr[key] = arr1[key];
    }

    return retArr;
};

global.__jymfony.diff_key = diffKey;
