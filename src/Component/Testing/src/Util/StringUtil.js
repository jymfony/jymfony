/**
 * @memberOf Jymfony.Component.Testing.Util
 */
export default class StringUtil {
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

        if (isFunction(value)) {
            if (ReflectionClass.exists(value)) {
                return 'class ' + ReflectionClass.getClassName(value);
            }

            return 'function';
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
            if ('_jymfony_testing_doubler_double__' === reflection.name) {
                const parent = reflection.getParentClass();
                const construct = parent.getConstructor();
                let name = parent.name;
                if (construct === __jymfony.JObject || construct === Object) {
                    const interfaces = reflection.interfaces;
                    if (0 < interfaces.length) {
                        name = interfaces.map(i => i.name).join('&');
                    }
                }

                return 'mock(' + name + ')';
            }

            return reflection.name || 'Object';
        } catch {
            return value.toString();
        }
    }
}
