declare namespace Jymfony.Component.Runtime {
    import GenericRuntime = Jymfony.Component.Runtime.GenericRuntime;

    interface JymfonyRuntimeOptions extends GenericRuntimeOptions {
        disable_dotenv?: boolean,
        project_dir?: string,
        env?: Record<string, string>,
        dotenv_path?: string,
        prod_envs?: string[],
        test_envs?: string[],
        dotenv_overload?: boolean,
    }

    /**
     * Knows the basic conventions to run Jymfony apps.
     *
     * In addition to the options managed by GenericRuntime, it accepts the following options:
     *  - "env" to define the name of the environment the app runs in;
     *  - "disable_dotenv" to disable looking for .env files;
     *  - "dotenv_path" to define the path of dot-env files - defaults to ".env";
     *  - "prod_envs" to define the names of the production envs - defaults to ["prod"];
     *  - "test_envs" to define the names of the test envs - defaults to ["test"];
     *  - "dotenv_overload" to tell Dotenv to override existing vars
     *
     * When the "debug" / "env" options are not defined, they will fallback to the
     * "APP_DEBUG" / "APP_ENV" environment variables, and to the "--env|-e" / "--no-debug"
     * command line arguments if "jymfony/console" is installed.
     *
     * When the "jymfony/dotenv" component is installed, .env files are loaded.
     * When "jymfony/debug" is installed, it is registered in debug mode.
     *
     * On top of the base arguments provided by GenericRuntime,
     * this runtime can feed the app-callable with arguments of type:
     *  - Application, Command, InputInterface and/or OutputInterface
     *    from "jymfony/console" if the component is installed.
     *
     * This runtime can handle app-callables that return instances of either:
     *  - Application,
     *  - Command,
     *  - int|string|null as handled by GenericRuntime.
     */
    export class JymfonyRuntime extends GenericRuntime {
        #input;
        #output;
        #console;

        constructor(options?: JymfonyRuntimeOptions);

        getRunner(application?: object): RunnerInterface;
        getArgument(parameterName: string): any;

        static register(runtime: RuntimeInterface): RuntimeInterface;
    }
}
