/**
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
class ArgumentInterface {
    /**
     * @returns {*[]}
     */
    get values() {}

    /**
     * @param {*[]} values
     */
    set values(values) {}
}

module.exports = getInterface(ArgumentInterface);
