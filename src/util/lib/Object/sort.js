'use strict';

const collator = new Intl.Collator('en');

Object.sort = (obj) =>
    Array.from(__jymfony.getEntries(obj))
        .sort((a, b) => collator.compare(a[1], b[1]))
        .reduce((res, val) => (res[val[0]] = obj[val[0]], res), {});

Object.ksort = (obj) =>
    Array.from(__jymfony.getEntries(obj))
        .sort((a, b) => collator.compare(a[0], b[0]))
        .reduce((res, val) => (res[val[0]] = obj[val[0]], res), {});
