'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * @param {string} format
 * @param {...} a
 *
 * @returns {string}
 */
__jymfony.sprintf = (format, ...a) => {
    //  Discuss at: http://locutus.io/php/sprintf/
    // Original by: Ash Searle (http://hexmen.com/blog/)
    // Improved by: Michael White (http://getsprink.com)
    // Improved by: Jack
    // Improved by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: Dj
    // Improved by: Allidylls
    //    Input by: Paulo Freitas
    //    Input by: Brett Zamir (http://brett-zamir.me)

    const regex = /%%|%(\d+\$)?([-+'#0 ]*)(\*\d+\$|\*|\d+)?(?:\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
    let i = 0;

    const _pad = (str, len, chr = ' ', leftJustify = false) => {
        const padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };

    const justify = (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) => {
        const diff = minWidth - value.length;
        if (0 < diff) {
            if (leftJustify || !zeroPad) {
                value = _pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = [
                    value.slice(0, prefix.length),
                    _pad('', diff, '0', true),
                    value.slice(prefix.length),
                ].join('');
            }
        }

        return value;
    };

    const _formatBaseX = (value, base, prefix, leftJustify, minWidth, precision, zeroPad) => {
        // Note: casts negative numbers to positive ones
        const number = value >>> 0;
        prefix = (prefix && number && {
            '2': '0b',
            '8': '0',
            '16': '0x',
        }[base]) || '';
        value = prefix + _pad(number.toString(base), precision || 0, '0', false);

        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };

    // _formatString()
    const _formatString = (value, leftJustify, minWidth, precision, zeroPad, customPadChar) => {
        if (null !== precision && precision !== undefined) {
            value = value.slice(0, precision);
        }

        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };

    // DoFormat()
    const doFormat = (substring, valueIndex, flags, minWidth, precision, type) => {
        let number, prefix, method, textTransform, value;

        if ('%%' === substring) {
            return '%';
        }

        // Parse flags
        let leftJustify = false;
        let positivePrefix = '';
        let zeroPad = false;
        let prefixBaseX = false;
        let customPadChar = ' ';
        const flagsl = flags.length;
        let j;
        for (j = 0; j < flagsl; j++) {
            switch (flags.charAt(j)) {
                case ' ':
                    positivePrefix = ' ';
                    break;
                case '+':
                    positivePrefix = '+';
                    break;
                case '-':
                    leftJustify = true;
                    break;
                case '\'':
                    customPadChar = flags.charAt(j + 1);
                    break;
                case '0':
                    zeroPad = true;
                    customPadChar = '0';
                    break;
                case '#':
                    prefixBaseX = true;
                    break;
            }
        }

        // Parameters may be null, undefined, empty-string or real valued
        // We want to ignore null, undefined and empty-string values
        if (!minWidth) {
            minWidth = 0;
        } else if ('*' === minWidth) {
            minWidth = +a[i++];
        } else if ('*' === minWidth.charAt(0)) {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
            minWidth = +minWidth;
        }

        // Note: undocumented perl feature:
        if (0 > minWidth) {
            minWidth = -minWidth;
            leftJustify = true;
        }

        if (!isFinite(minWidth)) {
            throw new Error('sprintf: (minimum-)width must be finite');
        }

        if (!precision) {
            precision = -1 < 'fFeE'.indexOf(type) ? 6 : ('d' === type) ? 0 : undefined;
        } else if ('*' === precision) {
            precision = +a[i++];
        } else if ('*' === precision.charAt(0)) {
            precision = +a[precision.slice(1, -1)];
        } else {
            precision = +precision;
        }

        // Grab value using valueIndex if required?
        value = valueIndex ? a[valueIndex.slice(0, -1) - 1] : a[i++];

        switch (type) {
            case 's':
                return _formatString(value + '', leftJustify, minWidth, precision, zeroPad, customPadChar);
            case 'c':
                return _formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
            case 'b':
                return _formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'o':
                return _formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'x':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'X':
                return _formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
                    .toUpperCase();
            case 'u':
                return _formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
            case 'i':
            case 'd':
                number = +value || 0;
                // Plain Math.round doesn't just truncate
                number = Math.round(number - number % 1);
                prefix = 0 > number ? '-' : positivePrefix;
                value = prefix + _pad(String(Math.abs(number)), precision, '0', false);
                return justify(value, prefix, leftJustify, minWidth, zeroPad);
            case 'e':
            case 'E':
            case 'f': // @todo: Should handle locales (as per setlocale)
            case 'F':
            case 'g':
            case 'G':
                number = +value;
                prefix = 0 > number ? '-' : positivePrefix;
                method = [ 'toExponential', 'toFixed', 'toPrecision' ]['efg'.indexOf(type.toLowerCase())];
                textTransform = [ 'toString', 'toUpperCase' ]['eEfFgG'.indexOf(type) % 2];
                value = prefix + Math.abs(number)[method](precision);
                return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
            default:
                return substring;
        }
    };

    return format.replace(regex, doFormat);
};
