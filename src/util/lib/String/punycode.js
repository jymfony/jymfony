'use strict';

global.__jymfony = global.__jymfony || {};

const separators = /[\x2E\u3002\uFF0E\uFF61]/g;
const nonASCII = /[^\x00-\x7F]/;

/**
 * Converts a digit/integer into a basic code point.
 *
 * @param {number} digit The numeric value of a basic code point.
 * @param {number} flag
 *
 * @returns {number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = (digit, flag) => {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (26 > digit) - ((0 !== flag) << 5);
};

/**
 * From punycode.js
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 *
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 *
 * @param {string} string The Unicode input string (UCS-2).
 *
 * @returns {number[]} The new array of code points.
 */
const ucs2decode = string => {
    const output = [], length = string.length;
    let counter = 0;

    while (counter < length) {
        const value = string.charCodeAt(counter++);
        if (0xD800 <= value && 0xDBFF >= value && counter < length) {
            // It's a high surrogate, and there is a next character.
            const extra = string.charCodeAt(counter++);
            if (0xDC00 === (extra & 0xFC00)) { // Low surrogate.
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // It's an unmatched surrogate; only append this code unit, in case the
                // Next code unit is the high surrogate of a surrogate pair.
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }

    return output;
};


/**
 * From punycode.js
 *
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
const adapt = (delta, numPoints, firstTime) => {
    let k = 0;
    delta = firstTime ? Math.floor(delta / 700) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    for (/* no initialization */; delta > 35 * 26 >> 1; k += 36) {
        delta = Math.floor(delta / 35);
    }
    return Math.floor(k + (35 + 1) * delta / (delta + 38));
};

/**
 * From punycode.js
 *
 * @param {string} string
 *
 * @returns {string}
 */
const encode = string => {
    const output = [];

    // Convert the input in UCS-2 to an array of Unicode code points.
    const input = ucs2decode(string);

    // Cache the length.
    const inputLength = input.length;

    // Initialize the state.
    let n = 0x80;
    let delta = 0;
    let bias = 72;

    // Handle the basic code points.
    for (const currentValue of input) {
        if (0x80 > currentValue) {
            output.push(String.fromCharCode(currentValue));
        }
    }

    const basicLength = output.length;
    let handledCPCount = basicLength;

    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.

    // Finish the basic string with a delimiter unless it's empty.
    if (basicLength) {
        output.push('-');
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
        // All non-basic code points < n have been handled already. Find the next larger one:
        let m = Number.MAX_SAFE_INTEGER;
        for (const currentValue of input) {
            if (currentValue >= n && currentValue < m) {
                m = currentValue;
            }
        }

        // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
        // But guard against overflow.
        const handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > Math.floor((Number.MAX_SAFE_INTEGER - delta) / handledCPCountPlusOne)) {
            throw new Error('Overflow: input needs wider integers to process');
        }

        delta += (m - n) * handledCPCountPlusOne;
        n = m;

        for (const currentValue of input) {
            if (currentValue < n && ++delta > Number.MAX_SAFE_INTEGER) {
                throw new Error('Overflow: input needs wider integers to process');
            }

            if (currentValue === n) {
                // Represent delta as a generalized variable-length integer.
                let q = delta;
                for (let k = 36; /* no condition */; k += 36) {
                    const t = k <= bias ? 1 : (k >= bias + 26 ? 26 : k - bias);
                    if (q < t) {
                        break;
                    }
                    const qMinusT = q - t;
                    const baseMinusT = 36 - t;
                    output.push(
                        String.fromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                    );
                    q = Math.floor(qMinusT / baseMinusT);
                }

                output.push(String.fromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
                delta = 0;
                ++handledCPCount;
            }
        }

        ++delta;
        ++n;

    }

    return 'xn--' + output.join('');
};

/**
 * Converts unicode domains to ascii.
 *
 * @param {string} string
 *
 * @returns {string}
 */
__jymfony.punycode_to_ascii = string => {
    return string.replace(separators, '.')
        .split('.')
        .map(substr => substr.match(nonASCII) ? encode(substr) : substr)
        .join('.');
};
