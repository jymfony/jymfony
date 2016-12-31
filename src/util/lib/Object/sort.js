'use strict';

Object.sort = (obj) =>
    Array.from(__jymfony.getEntries(obj))
        .sort((a, b) => a[1] - b[1])
        .reduce((res, val) => (res[val[0]] = obj[val[0]], res), {});

