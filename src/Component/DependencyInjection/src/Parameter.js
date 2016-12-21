/**
 * @memberOf Jymfony.DependencyInjection
 */
module.exports = class Parameter {
    constructor(id) {
        this._id = id;
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
