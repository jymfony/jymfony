'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.regex_quote = function (str) {
    return str.toString()
        .replace(/[.\\+*?\[\^\]$(){}=!<>|:-]/g, '\\$&');
};
