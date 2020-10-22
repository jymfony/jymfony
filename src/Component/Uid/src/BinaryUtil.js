const BASE10 = {
    '': '0123456789',
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
};

const BASE58 = {
    '': '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 'A': 9,
    'B': 10, 'C': 11, 'D': 12, 'E': 13, 'F': 14, 'G': 15,
    'H': 16, 'J': 17, 'K': 18, 'L': 19, 'M': 20, 'N': 21,
    'P': 22, 'Q': 23, 'R': 24, 'S': 25, 'T': 26, 'U': 27,
    'V': 28, 'W': 29, 'X': 30, 'Y': 31, 'Z': 32, 'a': 33,
    'b': 34, 'c': 35, 'd': 36, 'e': 37, 'f': 38, 'g': 39,
    'h': 40, 'i': 41, 'j': 42, 'k': 43, 'm': 44, 'n': 45,
    'o': 46, 'p': 47, 'q': 48, 'r': 49, 's': 50, 't': 51,
    'u': 52, 'v': 53, 'w': 54, 'x': 55, 'y': 56, 'z': 57,
};

// https://tools.ietf.org/html/rfc4122#section-4.1.4
// 0x01b21dd213814000 is the number of 100-ns intervals between the
// UUID epoch 1582-10-15 00:00:00 and the Unix epoch 1970-01-01 00:00:00.
const TIME_OFFSET_INT = 0x01b21dd213814000;

/**
 * @internal
 *
 * @memberOf Jymfony.Component.Uid
 */
export default class BinaryUtil {
    /**
     * @param {Buffer} input
     * @param {Object.<string, string>} map
     *
     * @returns {string}
     */
    static toBase(input, map) {
        const alphabet = map[''];
        const base = Object.keys(alphabet).length;

        let bytes = [];
        for (let i = 0; i < input.length; i += 2) {
            bytes.push(input.readUInt16BE(i));
        }

        let digits = '';
        let count;

        while ((count = bytes.length)) {
            const quotient = [];
            let remainder = 0;

            for (let i = 0; i !== count; ++i) {
                const carry = bytes[i] + (remainder << 16);
                const digit = ~~(carry / base);
                remainder = carry % base;

                if (digit || 0 < quotient.length) {
                    quotient.push(digit);
                }
            }

            digits = alphabet[remainder] + digits;
            bytes = quotient;
        }

        return digits;
    }

    /**
     * @param {string} input
     * @param {Object.<string, string>} map
     *
     * @returns {Buffer}
     */
    static fromBase(input, map) {
        let digits = input.split('');
        const base = map[''].length;
        let count = digits.length;
        const bytes = [];

        while (count) {
            const quotient = [];
            let remainder = 0;

            for (let i = 0; i !== count; ++i) {
                const carry = (bytes.length ? digits[i] : map[digits[i]]) + remainder * base;

                const digit = carry >> 16;
                remainder = carry & 0xFFFF;

                if (digit || 0 < quotient.length) {
                    quotient.push(digit);
                }
            }

            bytes.push(remainder);
            count = (digits = quotient).length;
        }

        const buf = Buffer.allocUnsafe(bytes.length * 2);
        bytes.reverse().forEach((b, index) => buf.writeUInt16BE(b, index * 2));

        return buf;
    }

    /**
     * @param {string} a
     * @param {string} b
     *
     * @returns {string}
     */
    static add(a, b) {
        let carry = 0;
        for (let i = 7; 0 <= i; --i) {
            carry += a.charCodeAt(i) + b.charCodeAt(i);
            a[i] = String.fromCharCode(carry & 0xFF);
            carry >>= 8;
        }

        return a;
    }

    /**
     * @param {string} time
     *
     * @returns {number}
     */
    static timeToFloat(time) {
        return (Number.parseInt(time, 16) - TIME_OFFSET_INT) / 10000000;
    }
}

Object.defineProperties(BinaryUtil, {
    BASE10: { configurable: false, writable: false, value: BASE10 },
    BASE58: { configurable: false, writable: false, value: BASE58 },
});
