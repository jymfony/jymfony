/**
 * Enables decoupling applications from global state.
 *
 * @memberof Jymfony.Component.Runtime
 */
class RuntimeInterface {
    /**
     * Returns a resolver that should compute the arguments of a callable.
     *
     * The callable itself should return an object that represents the application to pass to the getRunner() method.
     *
     * @param {Function} callable
     *
     * @returns {Jymfony.Component.Runtime.Resolver.ResolverInterface}
     */
    getResolver(callable) { }

    /**
     * Returns a callable that knows how to run the passed object and that returns its exit status as int.
     *
     * The passed object is typically created by calling ResolverInterface::resolve().
     *
     * @param {object} application
     *
     * @returns {Jymfony.Component.Runtime.RunnerInterface}
     */
    getRunner(application) { }
}

export default getInterface(RuntimeInterface);
