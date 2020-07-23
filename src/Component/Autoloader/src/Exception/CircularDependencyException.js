class CircularDependencyException extends Error {
    /**
     * Constructor.
     *
     * @param {string} required
     */
    constructor(required) {
        super('Circular reference with ' + required);

        /**
         * @type {string}
         */
        this.requiring = undefined;

        /**
         * @type {string}
         */
        this.required = required;
    }
}

module.exports = CircularDependencyException;
