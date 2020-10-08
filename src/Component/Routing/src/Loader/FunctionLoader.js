const Loader = Jymfony.Component.Config.Loader.Loader;

/**
 * ClosureLoader loads routes from a function.
 *
 * The Closure must return a RouteCollection instance.
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class FunctionLoader extends Loader {
    /**
     * Loads a Closure.
     *
     * @param {Function} closure A Closure
     *
     * @returns {Jymfony.Component.Routing.RouteCollection} A RouteCollection instance
     */
    load(closure) {
        return closure();
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        return isFunction(resource) && (! type || 'function' === type);
    }
}
