'use strict';

String.prototype.strtr = function (replacePairs) {
    let str = this.toString(), key, re;

    for (key in replacePairs) {
        if (replacePairs.hasOwnProperty(key)) {
            re = new RegExp(key, "g");
            str = str.replace(re, replacePairs[key]);
        }
    }

    return str;
};
