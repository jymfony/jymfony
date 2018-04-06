const RuntimeException = Jymfony.Component.DependencyInjection.Exception.RuntimeException;
const ParameterNotFoundException = Jymfony.Component.DependencyInjection.Exception.ParameterNotFoundException;
const ParameterCircularReferenceException = Jymfony.Component.DependencyInjection.Exception.ParameterCircularReferenceException;

/**
 * Holds parameters.
 *
 * @memberOf Jymfony.Component.DependencyInjection.ParameterBag
 */
class ParameterBag {
    /**
     * Constructor.
     *
     * @param {Object} params
     */
    __construct(params = {}) {
        this._params = {};
        this._env = {};
        this._resolved = false;

        for (const [ name, value ] of __jymfony.getEntries(params)) {
            this.set(name, value);
        }
    }

    /**
     * Empties the parameter bag
     */
    clear() {
        this._params = {};
    }

    /**
     * Add parameters to the parameter bag
     *
     * @param {Object<string, string>} params
     * @param {boolean} overwrite
     */
    add(params, overwrite = true) {
        for (const [ key, value ] of __jymfony.getEntries(params)) {
            if (! overwrite && this._params.hasOwnProperty(key)) {
                continue;
            }

            this._params[key.toLowerCase()] = value;
        }
    }

    /**
     * Get a copy of the parameters map
     *
     * @returns {Map}
     */
    all() {
        return Object.assign({}, this._params);
    }

    /**
     * Gets a parameter.
     *
     * @param name
     *
     * @returns {*}
     */
    get(name) {
        if ('env()' !== name && 'env(' === name.substr(0, 4) && ')' === name.substr(-1, 1)) {
            const matches = /env\((.+)\)/.exec(name);
            const envVarName = matches[1];
            if (undefined !== this._env[envVarName]) {
                return this._env[envVarName];
            } else if (undefined !== process.env[envVarName]) {
                return this._env[envVarName] = process.env[envVarName];
            }

            return this._env[envVarName] = this._get(name.toLowerCase(), true);
        }

        return this._get(name.toLowerCase());
    }

    /**
     * Add a parameter
     *
     * @param {string} name
     * @param {string} value
     */
    set(name, value) {
        this._params[name.toLowerCase()] = value;
    }

    /**
     * Returns true if the specified parameter is defined
     *
     * @param name
     * @returns {boolean}
     */
    has(name) {
        return this._params.hasOwnProperty(name.toLowerCase());
    }

    /**
     * Removes a parameter
     *
     * @param name
     */
    remove(name) {
        delete this._params[name.toLowerCase()];
    }

    /**
     * Replaces parameter placeholders (%name%) by their values for all parameters
     */
    resolve() {
        if (this._resolved) {
            return;
        }

        const resolved = {};
        for (let [ key, value ] of __jymfony.getEntries(this._params)) {
            try {
                value = this.resolveValue(value);
                resolved[key] = this.unescapeValue(value);
            } catch (e) {
                if (e instanceof ParameterNotFoundException) {
                    e.sourceKey = key;
                }

                throw e;
            }
        }

        this._params = resolved;
        this._resolved = true;
    }

    /**
     * Replaces parameter placeholders (%name%) by their values for all parameters.
     *
     * @param {*} value
     * @param {Set} resolving
     *
     * @returns {*}
     */
    resolveValue(value, resolving = new Set()) {
        if (isArray(value) || isObjectLiteral(value)) {
            const args = isArray(value) ? [] : {};
            for (const [ k, v ] of __jymfony.getEntries(value)) {
                args[this.resolveValue(k, new Set(resolving))] = this.resolveValue(v, new Set(resolving));
            }

            return args;
        }

        if (! isString(value)) {
            return value;
        }

        return this.resolveString(value, new Set(resolving));
    }

    /**
     * Resolves parameters inside a string
     *
     * @param {string} value
     * @param {Set} resolving
     *
     * @returns {*}
     */
    resolveString(value, resolving) {
        if ('%env()%' !== value && '%env(' === value.substr(0, 5) && ')%' === value.substr(-2, 2)) {
            return value;
        }

        const match = /^%([^%\s]+)%$/.exec(value);
        if (match) {
            const key = match[1].toLowerCase();

            if (resolving.has(key)) {
                throw new ParameterCircularReferenceException(resolving.values());
            }

            resolving.add(key);
            return this._resolved ? this.get(match[1]) : this.resolveValue(this.get(match[1]), resolving);
        }

        return value.replace(/%%|%([^%\s]+)%/g, (match, p1) => {
            if (! p1) {
                return '%%';
            }

            const key = p1.toLowerCase();
            if (resolving.has(key)) {
                throw new ParameterCircularReferenceException(Array.from(resolving));
            }

            let resolved = this.get(p1);

            if (! isString(resolved) && ! isNumber(resolved)) {
                throw new RuntimeException(`A string value must be composed of strings and/or numbers, but found parameter "${key}" of type ${typeof resolved} inside string value "${value}".`);
            }

            resolved = resolved.toString();
            resolving.add(key);

            return this._resolved ? resolved : this.resolveString(resolved, resolving);
        });
    }

    get resolved() {
        return this._resolved;
    }

    /**
     * Escape parameter placeholders %
     *
     * @param {*} value
     *
     * @returns {*}
     */
    escapeValue(value) {
        if (isString(value)) {
            return value.replace(/%/g, '%%');
        }

        if (isArray(value) || isObjectLiteral(value)) {
            const result = isArray(value) ? [] : {};
            for (const [ k, v ] of __jymfony.getEntries(value)) {
                result[k] = this.escapeValue(v);
            }

            return result;
        }

        return value;
    }

    /**
     * Unescape parameter placeholders %
     *
     * @param {*} value
     *
     * @returns {*}
     */
    unescapeValue(value) {
        if (isString(value)) {
            return value.replace(/%%/g, '%');
        }

        if (value instanceof Map) {
            const result = new Map();
            for (const [ k, v ] of value) {
                result.set(k, this.unescapeValue(v));
            }

            return result;
        }

        return value;
    }

    /**
     * Gets a parameter from the parameter list.
     *
     * @param {string} name
     * @param {boolean} strictlyScalar
     *
     * @returns {*}
     *
     * @private
     */
    _get(name, strictlyScalar = false) {
        if (! this._params.hasOwnProperty(name)) {
            throw new ParameterNotFoundException(name, null, null);
        }

        const param = this._params[name];
        if (strictlyScalar && ! isScalar(param)) {
            throw new RuntimeException(__jymfony.sprintf('The value for parameter "%s" must be a scalar, %s given.', name, typeof param));
        }

        return param;
    }
}

module.exports = ParameterBag;
