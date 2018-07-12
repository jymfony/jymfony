/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class Parameter {
    /**
     * Constructor.
     *
     * @param {string} id
     */
    __construct(id) {
        this._id = id;
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

module.exports = Parameter;
