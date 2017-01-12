let ParameterNotFoundException = Jymfony.DependencyInjection.Exception.ParameterNotFoundException;
let ParameterCircularReferenceException = Jymfony.DependencyInjection.Exception.ParameterCircularReferenceException;

/**
 * Holds parameters
 *
 * @memberOf Jymfony.DependencyInjection.ParameterBag
 */
module.exports = class ParameterBag {
    constructor(params = {}) {
        this._params = Object.assign({}, params);
        this._resolved = false;
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
        for (let [ key, value ] of __jymfony.getEntries(params)) {
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
     * Get a parameter
     *
     * @param name
     * @returns {string}
     */
    get(name) {
        name = name.toLowerCase();
        
        if (! this._params.hasOwnProperty(name)) {
            throw new ParameterNotFoundException(name, null, null);
        }

        return this._params[name];
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

        let resolved = {};
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
    resolveValue(value, resolving = new Set) {
        if (isArray(value) || isObjectLiteral(value)) {
            let args = isArray(value) ? [] : {};
            for (let [ k, v ] of __jymfony.getEntries(value)) {
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
        let match = /^%([^%\s]+)%$/.exec(value);
        if (match) {
            let key = match[1].toLowerCase();

            if (resolving.has(key)) {
                throw new ParameterCircularReferenceException(resolving.values());
            }

            resolving.add(key);
            return this._resolved ? this.get(key) : this.resolveValue(this.get(key), resolving);
        }

        return value.replace(/%%|%([^%\s]+)%/g, (match, p1) => {
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
    escapeValue(value) {
        if (isString(value)) {
            return value.replace(/%/g, '%%');
        }

        if (isArray(value) || isObjectLiteral(value)) {
            let result = isArray(value) ? [] : {};
            for (let [ k, v ] of __jymfony.getEntries(value)) {
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
            let result = new Map;
            for (let [ k, v ] of value) {
                result.set(k, this.unescapeValue(v));
            }

            return result;
        }

        return value;
    }
};
