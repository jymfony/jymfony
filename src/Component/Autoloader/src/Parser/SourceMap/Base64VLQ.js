const intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
const base64_encode = (number) => {
    if (0 <= number && number < intToCharMap.length) {
        return intToCharMap[number];
    }

    throw new TypeError('Must be between 0 and 63: ' + number);
};

const base64_decode = (charCode) => {
    const bigA = 65; // 'A'
    const bigZ = 90; // 'Z'

    const littleA = 97; // 'a'
    const littleZ = 122; // 'z'

    const zero = 48; // '0'
    const nine = 57; // '9'

    const plus = 43; // '+'
    const slash = 47; // '/'

    const littleOffset = 26;
    const numberOffset = 52;

    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
    if (bigA <= charCode && charCode <= bigZ) {
        return (charCode - bigA);
    }

    // 26 - 51: abcdefghijklmnopqrstuvwxyz
    if (littleA <= charCode && charCode <= littleZ) {
        return (charCode - littleA + littleOffset);
    }

    // 52 - 61: 0123456789
    if (zero <= charCode && charCode <= nine) {
        return (charCode - zero + numberOffset);
    }

    // 62: +
    if (charCode == plus) {
        return 62;
    }

    // 63: /
    if (charCode == slash) {
        return 63;
    }

    // Invalid base64 digit.
    return -1;
};

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// Length quantities we use in the source map spec, the first bit is the sign,
// The next four bits are the actual value, and the 6th bit is the
// Continuation bit. The continuation bit tells us whether there are more
// Digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

const VLQ_BASE_SHIFT = 5;

// Binary: 100000
const VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// Binary: 011111
const VLQ_BASE_MASK = VLQ_BASE - 1;

// Binary: 100000
const VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
const toVLQSigned = value => 0 > value ? ((-value) << 1) + 1 : (value << 1) + 0;

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
const fromVLQSigned = aValue => 1 === (aValue & 1) ? -(aValue >> 1) : aValue >> 1;

class Base64VLQ {
    /**
     * Returns the base 64 VLQ encoded value.
     */
    static encode(value) {
        let encoded = '';
        let digit;
        let vlq = toVLQSigned(value);

        do {
            digit = vlq & VLQ_BASE_MASK;
            vlq >>>= VLQ_BASE_SHIFT;
            if (0 < vlq) {
                // There are still more digits in this value, so we must make sure the
                // Continuation bit is marked.
                digit |= VLQ_CONTINUATION_BIT;
            }

            encoded += base64_encode(digit);
        } while (0 < vlq);

        return encoded;
    }

    /**
     * Decodes the next base 64 VLQ value from the given string.
     */
    static decode(str, index) {
        const strLen = str.length;
        let result = 0;
        let shift = 0;
        let continuation, digit;

        do {
            if (index >= strLen) {
                throw new Error('Expected more digits in base 64 VLQ value.');
            }

            digit = base64_decode(str.charCodeAt(index++));
            if (-1 === digit) {
                throw new Error('Invalid base64 digit: ' + str.charAt(index - 1));
            }

            continuation = !!(digit & VLQ_CONTINUATION_BIT);
            digit &= VLQ_BASE_MASK;
            result = result + (digit << shift);
            shift += VLQ_BASE_SHIFT;
        } while (continuation);

        return [ fromVLQSigned(result), index ];
    }
}

module.exports = Base64VLQ;
