/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
export default class Parameter {
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
