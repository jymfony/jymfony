/**
 * @memberOf Jymfony.Component.Testing.Util
 */
class StringUtil {
    /**
     * Gives a string representation of the value (to be printed out in exceptions)
     *
     * @param {*} value
     *
     * @returns {string}
     */
    static stringify(value) {
        if (null === value) {
            return 'null';
        }

        if (undefined === value) {
            return 'undefined';
        }

        if (true === value) {
            return 'true';
        }

        if (false === value) {
            return 'false';
        }

        if (isArray(value)) {
            for (const key of Object.keys(value)) {
                value[key] = __self.stringify(value[key]);
            }

            return '[' + value.join(', ') + ']';
        }

        const t = typeof value;
        if ('object' !== t) {
            return JSON.stringify(value);
        }

        try {
            const reflection = new ReflectionClass(value);
            return reflection.name || 'Object';
        } catch (e) {
            return value.toString();
        }
    }
}

module.exports = StringUtil;
