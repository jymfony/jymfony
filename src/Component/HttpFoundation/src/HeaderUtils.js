/**
 * @memberOf Jymfony.Component.HttpFoundation
 */
class HeaderUtils {
    /**
     * Joins an object into a string for use in an HTTP header.
     *
     * @param {Object.<string, string>} obj
     * @param {string} separator
     *
     * @returns {string}
     */
    static toString(obj, separator) {
        const parts = [];
        Object.ksort(obj);
        for (let [ key, value ] of __jymfony.getEntries(obj)) {
            if (true === value) {
                parts.push(key);
            } else {
                if (String(value).match(/[^a-zA-Z0-9._-]/)) {
                    value = '"'+value+'"';
                }

                parts.push(key + '=' + value);
            }
        }

        return parts.join(separator + ' ');
    }

    /**
     * Splits an HTTP header by one or more separators.
     *
     * @param {string} header HTTP header value
     * @param {string} separators List of characters to split on, ordered by
     *                            precedence, e.g. ",", ";=", or ",;="
     *
     * @returns {Array} Nested array with as many levels as there are characters in separators
     */
    static split(header, separators) {
        const quotedSeparators = __jymfony.regex_quote(separators);
        const pattern = '(?!\\s)(?:"(?:[^"\\\\\\\\]|\\\\\\\\.)*(?:"|\\\\\\\\|$)|[^"\''+quotedSeparators+'\']+)+(?<!\\s)|\\s*(?<separator>[\''+quotedSeparators+'\'])\\s*';
        const regex = new RegExp(pattern, 'g');

        const matches = [];
        let m;
        while ((m = regex.exec(header))) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            matches.push(m);
        }

        return __self._groupParts(matches, separators);
    }

    /**
     * Decodes a quoted string.
     *
     * If passed an unquoted string that matches the "token" construct (as
     * defined in the HTTP specification), it is passed through verbatimly.
     */
    static unquote(s) {
        return s.replace(/\\(.)|"/, '$1');
    }

    /**
     * Combines an array of arrays into one object.
     *
     * Each of the nested arrays should have one or two elements. The first
     * value will be used as the keys in the associative array, and the second
     * will be used as the values, or true if the nested array only contains one
     * element. Object keys are lowercased.
     *
     * Example:
     *
     *     HeaderUtils.combine([["foo", "abc"], ["bar"]])
     *     // => {"foo": "abc", "bar": true}
     *
     * @param {Array} parts
     *
     * @returns {Object}
     */
    static combine(parts) {
        const assoc = {};
        for (const part of parts) {
            const name = part[0].toLowerCase();
            assoc[name] = part[1] || true;
        }

        return assoc;
    }

    static _groupParts(matches, separators) {
        const separator = separators.charAt(0);
        const partSeparators = separators.substr(1);

        let i = 0;
        const partMatches = new HashTable();
        for (const match of matches) {
            if (match.groups && match.groups.separator === separator) {
                ++i;
            } else {
                if (! partMatches.has(i)) {
                    partMatches.put(i, new HashTable());
                }

                partMatches.get(i).push(match);
            }
        }

        const parts = [];
        if (partSeparators) {
            for (const matches of partMatches.toObject()) {
                parts.push(__self._groupParts(matches, partSeparators));
            }
        } else {
            for (const matches of partMatches.toObject()) {
                parts.push(__self.unquote(matches[0][0]));
            }
        }

        return parts;
    }
}

module.exports = HeaderUtils;
