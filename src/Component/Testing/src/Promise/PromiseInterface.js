/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class PromiseInterface {
    /**
     * Evaluates promise.
     *
     * @param {*[]} args
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} object
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} method
     *
     * @returns {*}
     */
    execute(args, object, method) { }
}

module.exports = getInterface(PromiseInterface);
