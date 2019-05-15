/**
 * @memberOf Jymfony.Component.VarExporter.Internal
 */
class Reference {
    /**
     * Constructor.
     *
     * @param {int} id
     * @param {*} value
     */
    __construct(id, value = null) {
        /**
         * @type {int}
         */
        this.id = id;

        /**
         * @type {*}
         */
        this.value = value;
    }
}

module.exports = Reference;
