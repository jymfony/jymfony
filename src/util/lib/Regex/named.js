'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

if (! __jymfony.Platform.hasModernRegex()) {
    __jymfony.RegExp = RegExp;

    const regexpClass = class RegExp extends __jymfony.RegExp {
        /**
         * Constructor.
         *
         * @param {string} pattern
         * @param {string} flags
         */
        constructor(pattern, flags = undefined) {
            const names = [];
            const sanitized = String(pattern)
                .replace(/\(\?<(\w+)?>|\((?!\?[:!=<])/g, (_, name) => {
                    names.push(name);
                    return '(';
                })
                .replace(/\\k<(\w+)>/g, (_, name) => {
                    const index = names.indexOf(name);
                    if (-1 === index) {
                        throw new SyntaxError('Invalid regular expression: ' + pattern + ': Invalid named capture referenced');
                    }

                    return '\\' + (index + 1);
                });

            super(sanitized, flags);
            this._source = pattern;
            this._names = names;
        }

        /**
         * @returns {string}
         */
        get source() {
            return this._source;
        }

        /**
         * Check whether the instance argument is a regex.
         *
         * @param {*} instance
         */
        static [Symbol.hasInstance](instance) {
            if (! instance) {
                return false;
            }

            return instance.constructor === RegExp || instance.constructor === __jymfony.RegExp;
        }

        /**
         * @param {string} string
         *
         * @returns {Object}
         */
        exec(string) {
            const result = super.exec(string);
            if (! result || ! /\(\?<(\w+)>/.test(this._source)) {
                return result;
            }

            const groups = {};
            for (let i = 1; i <= this._names.length; i++) {
                const name = this._names[i - 1];
                if (undefined !== name) {
                    groups[name] = result[i];
                }
            }

            result.groups = groups;

            return result;
        }
    };

    globalThis.RegExp = new Proxy(regexpClass, {
        apply(target, thisArg, argArray) {
            return new target(...argArray);
        },
    });
}
