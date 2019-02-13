'use strict';

global.__jymfony = global.__jymfony || {};

const substr_replace_internal = (search, replacement, start, length) => {
    if (0 > start) {
        start = start + search.length;
    }

    length = undefined === length ? search.length : length;
    if (0 > length) {
        length = length + search.length - start;
    }

    return [
        search.slice(0, start),
        replacement,
        search.slice(start + length),
    ].join('');
};

/**
 * Replace text within a portion of a string
 */
__jymfony.substr_replace = (search, replacement, start, length = undefined) => {
    if (isArray(search)) {
        return search.map((s, index) => {
            return substr_replace_internal(
                s,
                isArray(replacement) ? replacement[index] : replacement,
                isArray(start) ? start[index] : start,
                isArray(length) ? length[index] : length
            );
        });
    }

    return substr_replace_internal(search, replacement, start, length);
};
