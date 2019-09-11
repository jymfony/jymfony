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

export default getInterface(ArgumentInterface);
