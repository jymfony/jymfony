let ParameterNotFoundException = Jymfony.DependencyInjection.Exception.ParameterNotFoundException;
let ParameterCircularReferenceException = Jymfony.DependencyInjection.Exception.ParameterCircularReferenceException;

/**
 * Holds parameters
 *
 * @memberOf Jymfony.DependencyInjection.ParameterBag
 */
module.exports = class ParameterBag {
    constructor(params = {}) {
        this._params = new Map(__jymfony.getEntries(params));
        this._resolved = false;
    }

    /**
     * Empties the parameter bag
     */
    clear() {
        this._params = new Map();
    }

    /**
     * Add parameters to the parameter bag
     *
     * @param {Object<string, string>} params
     * @param {boolean} overwrite
     */
    add(params, overwrite = true) {
        for (let [key, value] of __jymfony.getEntries(params)) {
            if (! overwrite && this._params.has(key)) {
                continue;
            }

            this._params.set(key.toLowerCase(), value);
        }
    }

    /**
     * Get a copy of the parameters map
     *
     * @returns {Map}
     */
    all() {
        return new Map(this._params);
    }

    /**
     * Get a parameter
     *
     * @param name
     * @returns {string}
     */
    get(name) {
        name = name.toLowerCase();
        
        if (! this._params.has(name)) {
            throw new ParameterNotFoundException(name, null, null);
        }

        return this._params.get(name);
    }

    /**
     * Add a parameter
     *
     * @param {string} name
     * @param {string} value
     */
    set(name, value) {
        this._params.set(name.toLowerCase(), value);
    }

    /**
     * Returns true if the specified parameter is defined
     *
     * @param name
     * @returns {boolean}
     */
    has(name) {
        return this._params.has(name.toLowerCase());
    }

    /**
     * Removes a parameter
     *
     * @param name
     */
    remove(name) {
        this._params.delete(name.toLowerCase());
    }

    /**
     * Replaces parameter placeholders (%name%) by their values for all parameters
     */
    resolve() {
        if (this._resolved) {
            return;
        }

        let resolved = new Map;
        for (let [key, value] of this._params.entries()) {
            try {
                value = this.resolveValue(value);
                resolved.set(key, this.unescapeValue(value));
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
    resolveValue(value, resolving = new Set) {
        if (value instanceof Map) {
            let args = new Map;
            for (let [k, v] of value.entries()) {
                args.set(this.resolveValue(k, new Set(resolving)), this.resolveValue(v, new Set(resolving)));
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
        let match = /^%([^%\s]+)%$/.exec(value);
        if (match) {
            let key = match[1].toLowerCase();

            if (resolving.has(key)) {
                throw new ParameterCircularReferenceException(resolving.values());
            }

            resolving.add(key);
            return this._resolved ? this.get(key) : this.resolveValue(this.get(key), resolving);
        }

        return value.replace(/%%|%([^%\s]+)%/, (match, p1) => {
            if (! p1) {
                return '%%';
            }
            
            let key = p1.toLowerCase();
            if (resolving.has(key)) {
                throw new ParameterCircularReferenceException(Array.from(resolving));
            }
            
            let resolved = this.get(key);
            
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
    escapeValue(value)
    {
        if (isString(value)) {
            return value.replace('%', '%%');
        }

        if (isArray(value)) {
            let result = new Map;
            for (let [k, v] of value) {
                result.add(k, this.escapeValue(v));
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
    unescapeValue(value)
    {
        if (isString(value)) {
            return value.replace('%%', '%');
        }

        if (value instanceof Map) {
            let result = new Map;
            for (let [k, v] of value) {
                result.set(k, this.unescapeValue(v));
            }

            return result;
        }

        return value;
    }
};
