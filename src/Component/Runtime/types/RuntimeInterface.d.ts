declare namespace Jymfony.Component.Runtime {
    /**
     * Enables decoupling applications from global state.
     */
    export class RuntimeInterface {
        public static readonly definition: Newable<RuntimeInterface>;

        /**
         * Returns a resolver that should compute the arguments of a callable.
         *
         * The callable itself should return an object that represents the application to pass to the getRunner() method.
         */
        getResolver(callable: Function): ResolverInterface;

        /**
         * Returns a callable that knows how to run the passed object and that returns its exit status as int.
         *
         * The passed object is typically created by calling ResolverInterface.resolve().
         */
        getRunner(application: any): RunnerInterface;
    }
}
