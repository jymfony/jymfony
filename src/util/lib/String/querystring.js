'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.internal_parse_query_string = (params) => {
    const bag = new HashTable();
    for (const [ key, value ] of params) {
        if (-1 === key.indexOf('[')) {
            bag.put(key, value);
            continue;
        }

        if (/\[]/g.test(key) && /\[]./g.test(key)) {
            // Malformed string.
            return undefined;
        }

        let current = bag;
        const tokens = key.split('[');
        for (const [ loop, idx ] of __jymfony.getEntries(tokens)) {
            if (0 !== loop && ']' !== idx.substr(-1)) {
                // Malformed string.
                return undefined;
            }

            if (']' === idx) {
                current.push(value);
                break;
            }

            const index = idx.replace(/]$/, '');
            if (loop === tokens.length - 1) {
                current.put(index, value);
                break;
            }

            let curValue = current.get(index);
            if (curValue === undefined || ! (curValue instanceof HashTable)) {
                current.put(index, curValue = new HashTable());
            }

            current = curValue;
        }
    }

    return bag.toObject();
};

global.__jymfony.parse_query_string = function parse_query_string(str) {
    if (null === str) {
        return {};
    }

    const params = str.replace(/^[?#&]/, '')
        .split('&')
        .map(str => str.split('=', 2)
            .map(s => {
                s = s.replace(/\+/g, ' ');

                try {
                    return decodeURIComponent(s);
                } catch (e) {
                    if (e instanceof URIError) {
                        return s;
                    }

                    throw e;
                }
            })
        );

    return __jymfony.internal_parse_query_string(params);
};
