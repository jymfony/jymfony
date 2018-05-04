/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Variable {
    /**
     * Constructor.
     *
     * @param {string} name
     */
    __construct(name) {
        this._id = name;
    }

    /**
     * Returns the variable name.
     *
     * @returns {string}
     */
    toString() {
        return this._id;
    }
}

module.exports = Variable;
