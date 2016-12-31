'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * If operator parameter is undefined returns -1 if version1 is
 * lower than version2, 0 if they are equal, 1 if the second is lower
 *
 * Otherwise returns true if the relationship is the one specified
 * by the operator, false otherwise
 *
 * @param {string|int} version1
 * @param {string|int} version2
 * @param {string|undefined} operator
 */
global.__jymfony.version_compare = function version_compare (version1, version2, operator = undefined) {
    // The function first replaces _, - and + with a dot . in the version string and also
    // inserts dots . before and after any non number so that for example '4.3.2RC1' becomes '4.3.2.RC.1'
    let prepareVersion = v => {
        v = v.replace(/[\-+_]/g, '.').replace(/([^.\d]+)/g, '.$1.').toLowerCase().split('.').filter(V => V !== '');
        return v.length ? v : [-7];
    };

    version1 = prepareVersion(version1);
    version2 = prepareVersion(version2);

    // Then it compares the parts starting from left to right. If a part contains special version
    // strings these are handled in the following order:
    // any string not found in this list < dev < alpha = a < beta = b < RC = rc < # < pl = p.
    const map = {
        'dev': -4,
        'alpha': -3,
        'a': -3,
        'beta': -2,
        'b': -2,
        'rc': -1,
        'pl': 'p',
        'p': 'p'
    };

    let numVer = v => {
        if (! v) {
            return 0;
        }

        let n = parseInt(v);
        return isNaN(n) ? (map[v] || -6) : n;
    };

    let compare = 0;
    let maxI = Math.max(version1.length, version2.length);
    for (let i = 0; i < maxI; i++) {
        let chunk1 = numVer(version1[i]);
        let chunk2 = numVer(version2[i]);

        if (chunk1 === chunk2) {
            // Do nothing and continue
        } else if (chunk1 === 'p') {
            compare = 1;
            break;
        } else if (chunk2 === 'p') {
            compare = -1;
            break;
        } else if (chunk1 > chunk2) {
            compare = 1;
            break;
        } else if (chunk1 < chunk2) {
            compare = -1;
            break;
        }
    }

    if (undefined === operator) {
        return compare;
    }

    // The possible operators are: <, lt, <=, le, >, gt, >=, ge, ==, =, eq, !=, <>, ne respectively.
    switch (operator) {
        case '<':
        case 'lt':
            return compare < 0;

        case '<=':
        case 'le':
            return compare <= 0;

        case '>':
        case 'gt':
            return compare > 0;

        case '>=':
        case 'ge':
            return compare >= 0;

        case '==':
        case '=':
        case 'eq':
            return compare === 0;

        case '!=':
        case '<>':
        case 'ne':
            return compare !== 0;
    }

    return undefined;
};
