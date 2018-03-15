'use strict';

global.__jymfony = global.__jymfony || {};

if (! __jymfony.Platform.hasModernRegex()) {
    __jymfony.RegExp = RegExp;

    const regexpClass = class RegExp extends __jymfony.RegExp {
        constructor(pattern, flags = undefined) {
            const names = [];
            const sanitized = pattern
                .replace(/\(\?<(\w+)>/g, (_, name) => {
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

        get source() {
            return this._source;
        }

        exec(string) {
            const result = super.exec(string);
            if (! result || ! /\(\?<(\w+)>/.test(this._source)) {
                return result;
            }

            const groups = {};
            for (let i = 1; i <= this._names.length; i++) {
                if (result[i]) {
                    groups[this._names[i - 1]] = result[i];
                }
            }

            result.groups = groups;

            return result;
        }
    };

    global.RegExp = function RegExp (pattern, flags = undefined) {
        return new regexpClass(pattern, flags);
    };
}
