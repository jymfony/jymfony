/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
module.exports = class Variable {
    __construct(name) {
        this._id = name;
    }

    /**
     * Returns the variable name
     *
     * @returns {string}
     */
    toString() {
        return this._id;
    }
};
