/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ArgumentInterface {
    /**
     * @returns {Array}
     */
    get values() {}

    /**
     * @param {Array} values
     */
    set values(values) {}
}

module.exports = getInterface(ArgumentInterface);
