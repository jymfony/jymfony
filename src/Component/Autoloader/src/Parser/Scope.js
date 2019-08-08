/**
 * Holds scope in compiler.
 *
 * @memberOf Jymfony.Component.Autoloader.Parser
 */
class Scope {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.Parser.Scope} parent
     */
    constructor(parent = null) {
        /**
         * @type {Jymfony.Component.Autoloader.Parser.Scope}
         *
         * @private
         */
        this._parent = parent;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._names = [];

        /**
         * @type {Object.<string, string>}
         *
         * @private
         */
        this._aliases = {};
    }

    /**
     * Pushes a new scope.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.Scope}
     */
    push() {
        return new Scope(this);
    }

    /**
     * Pops this scope and returns the parent scope.
     *
     * @returns {Jymfony.Component.Autoloader.Parser.Scope}
     */
    pop() {
        return this._parent;
    }

    /**
     * Checks if name is in current scope.
     *
     * @param {string} name
     *
     * @return {boolean}
     */
    has(name) {
        if (this._names.includes(name)) {
            return true;
        }

        return null !== this._parent && this._parent.has(name);
    }

    /**
     * Gets a name (or alias) in current scope.
     *
     * @param {string} name
     *
     * @return {string}
     */
    get(name) {
        if (! this._names.includes(name)) {
            if (this.has(name)) {
                return this._parent.get(name);
            }

            throw new SyntaxError('Undefined ' + name);
        }

        return this._aliases[name];
    }

    /**
     * Adds a name to the current scope.
     *
     * @param {string} name
     * @param {string} alias
     */
    add(name, alias = undefined) {
        this._names.push(name);
        this._aliases[name] = alias || name;
    }
}

module.exports = Scope;
