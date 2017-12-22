'use strict';

global.__jymfony = global.__jymfony || {};

const STR_PAD_LEFT = 'STR_PAD_LEFT';
const STR_PAD_RIGHT = 'STR_PAD_RIGHT';
const STR_PAD_BOTH = 'STR_PAD_BOTH';
const STR_PAD_TYPES = [
    STR_PAD_LEFT,
    STR_PAD_RIGHT,
    STR_PAD_BOTH,
];

/**
 * Adapted from http://www.webtoolkit.info/javascript_pad.htm
 *
 * @param {string} string
 * @param {int} length
 * @param {string} pad
 * @param {string} padType
 *
 * @returns {string}
 */
global.__jymfony.str_pad = (string, length = 0, pad = ' ', padType = STR_PAD_RIGHT) => {
    if (! STR_PAD_TYPES.includes(padType)) {
        throw new InvalidArgumentException('Invalid padding type. Expected one of (\'STR_PAD_LEFT\', \'STR_PAD_RIGHT\', \'STR_PAD_BOTH\').');
    }

    if (length + 1 < string.length) {
        return string;
    }

    switch (padType) {
        case STR_PAD_LEFT: {
            return Array(length + 1 - string.length).join(pad) + string;
        }

        case STR_PAD_BOTH: {
            const padLength = length - string.length;
            const right = Math.ceil(padLength / 2);
            const left = padLength - right;

            return Array(left + 1).join(pad) + string + Array(right + 1).join(pad);
        }

        default: {
            return string + Array(length + 1 - string.length).join(pad);
        }
    }
};

global.__jymfony.str_pad.LEFT = STR_PAD_LEFT;
global.__jymfony.str_pad.RIGHT = STR_PAD_RIGHT;
global.__jymfony.str_pad.BOTH = STR_PAD_BOTH;
