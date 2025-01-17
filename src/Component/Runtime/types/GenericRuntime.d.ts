declare namespace Jymfony.Component.Runtime {
    interface GenericRuntimeOptions {
        options?: boolean,
        runtimes?: Record<string, any>,
        error_handler?: string | false,
        env_var_name?: string,
        debug_var_name?: string,
    }

    /**
     * A runtime to do normalize engine behavior.
     *
     * It supports the following options:
     *  - "debug" toggles displaying errors and defaults
     *    to the "APP_DEBUG" environment variable;
     *  - "runtimes" maps types to a GenericRuntime implementation
     *    that knows how to deal with each of them;
     *  - "error_handler" defines the class to use to handle errors;
     *  - "env_var_name" and "debug_var_name" define the name of the env
     *    vars that hold the Jymfony env and the debug flag respectively.
     *
     * The app-callable can declare arguments among either:
     * - "env" to get an object containing all the environment variables;
     * - "argv" to get the command line arguments when running on the CLI;
     *
     * It should return a function():int|string|null or an instance of RunnerInterface.
     *
     * In debug mode, the runtime registers a strict error handler
     * that throws exceptions when a warning/notice is raised.
     */
    export class GenericRuntime extends implementationOf(RuntimeInterface) {
        public _options: Record<string, any>;

        constructor(options?: GenericRuntimeOptions);

        getResolver(callable: Function): ResolverInterface;
        getRunner(application?: object): RunnerInterface;
        getArgument(parameterName: string): any;

        static register(runtime: RuntimeInterface): RuntimeInterface;

        private _getRuntime(type: string): RuntimeInterface | null;
        private _resolveRuntime(klass: string): RuntimeInterface | null;
    }
}
