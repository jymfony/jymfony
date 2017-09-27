'use strict';

const os = require('os');
global.__jymfony = global.__jymfony || {};

/**
 * Wraps a string to a given number of characters.
 *
 * @param {string} str
 * @param {int} width
 * @param {string} strBreak
 * @param {boolean} cut
 */
__jymfony.wordwrap = function wordwrap (str, width = 75, strBreak = '\n', cut = false) {
    //  Discuss at: http://locutus.io/php/wordwrap/
    // Original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // Improved by: Nick Callen
    // Improved by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: Sakimori
    //  Revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // Bugfixed by: Michael Grier
    // Bugfixed by: Feras ALHAEK
    // Improved by: Rafał Kukawski (http://kukawski.net)
    //   Example 1: wordwrap('Kevin van Zonneveld', 6, '|', true)
    //   Returns 1: 'Kevin|van|Zonnev|eld'
    //   Example 2: wordwrap('The quick brown fox jumped over the lazy dog.', 20, '<br />\n')
    //   Returns 2: 'The quick brown fox<br />\njumped over the lazy<br />\ndog.'
    //   Example 3: wordwrap('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    //   Returns 3: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat.'
    let i, j, line;
    str += '';
    if (1 > width) {
        return str;
    }

    const reBeginningUntilFirstWhitespace = /^\S*/;
    const reLastCharsWithOptionalTrailingWhitespace = /\S*(\s)?$/;
    const lines = str.split(os.EOL);
    const l = lines.length;
    let match;

    // For each line of text
    for (i = 0; i < l; lines[i++] += line) {
        line = lines[i];
        lines[i] = '';
        while (line.length > width) {
            // Get slice of length one char above limit
            const slice = line.slice(0, width + 1);
            // Remove leading whitespace from rest of line to parse
            let ltrim = 0;
            // Remove trailing whitespace from new line content
            let rtrim = 0;
            match = slice.match(reLastCharsWithOptionalTrailingWhitespace);
            // If the slice ends with whitespace
            if (match[1]) {
                // Then perfect moment to cut the line
                j = width;
                ltrim = 1;
            } else {
                // Otherwise cut at previous whitespace
                j = slice.length - match[0].length;
                if (j) {
                    rtrim = 1;
                }
                // But if there is no previous whitespace
                // And cut is forced
                // Cut just at the defined limit
                if (!j && cut && width) {
                    j = width;
                }
                // If cut wasn't forced
                // Cut at next possible whitespace after the limit
                if (!j) {
                    const charsUntilNextWhitespace = (line.slice(width).match(reBeginningUntilFirstWhitespace) || [ '' ])[0];
                    j = slice.length + charsUntilNextWhitespace.length;
                }
            }
            lines[i] += line.slice(0, j - rtrim);
            line = line.slice(j + ltrim);
            lines[i] += line.length ? strBreak : '';
        }
    }

    return lines.join(os.EOL);
};
