'use strict';

global.__jymfony = global.__jymfony || {};

const STR_PAD_LEFT = 'STR_PAD_LEFT';
const STR_PAD_RIGHT = 'STR_PAD_RIGHT';
const STR_PAD_BOTH = 'STR_PAD_BOTH';

/**
 * Pad a string to a certain length with another string.
 *
 * @param {string} string
 * @param {int} length
 * @param {string} pad
 * @param {string} padType
 *
 * @returns {string}
 */
global.__jymfony.str_pad = (string, length = 0, pad = ' ', padType = STR_PAD_RIGHT) => {
    if (length < string.length) {
        return string;
    }

    const targetLength = length - string.length;
    const padString = pad.repeat(targetLength / pad.length);
    switch (padType) {
        case STR_PAD_LEFT: {
            return padString.slice(0, targetLength) + string;
        }

        case STR_PAD_BOTH: {
            const padLength = padString.length;
            const right = Math.ceil(padLength / 2);
            const left = padLength - right;

            return padString.slice(0, left) + string + padString.slice(0, right);
        }

        case STR_PAD_RIGHT: {
            return string + padString;
        }

        default: {
            throw new InvalidArgumentException('Invalid padding type. Expected one of (\'STR_PAD_LEFT\', \'STR_PAD_RIGHT\', \'STR_PAD_BOTH\').');
        }
    }
};

global.__jymfony.STR_PAD_LEFT = STR_PAD_LEFT;
global.__jymfony.STR_PAD_RIGHT = STR_PAD_RIGHT;
global.__jymfony.STR_PAD_BOTH = STR_PAD_BOTH;
