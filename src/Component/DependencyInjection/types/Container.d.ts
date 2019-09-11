declare namespace Jymfony.Component.DependencyInjection {
    import ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;

    export class Container extends implementationOf(ContainerInterface) {
        public static readonly EXCEPTION_ON_INVALID_REFERENCE = 1;
        public static readonly NULL_ON_INVALID_REFERENCE = 2;
        public static readonly IGNORE_ON_INVALID_REFERENCE = 3;
        public static readonly IGNORE_ON_UNINITIALIZED_REFERENCE = 4;

        /**
         * True if parameter bag is frozen.
         */
        public readonly frozen: boolean;

        /**
         * The container parameter bag.
         */
        public readonly parameterBag: ParameterBag;

        protected _parameterBag: ParameterBag;
        private _services: any;
        private _methodMap: any;
        private _privates: any;
        private _aliases: any;
        private _loading: any;
        private _shutdownCalls: any[];

        /**
         * Constructor.
         */
        __construct(parameterBag?: ParameterBag): void;
        constructor(parameterBag?: ParameterBag);

        /**
         * Compiles the container.
         */
        compile(): void;

        /**
         * Gets a parameter.
         */
        getParameter(name: string): string | Parameter;

        /**
         * Checks if a parameter exists.
         */
        hasParameter(name: string): boolean;

        /**
         * Sets a parameter.
         */
        setParameter(name: string, value: string | Parameter): void;

        /**
         * Sets a service.
         */
        set(id: string | symbol | Function, service: any): void;

        /**
         * Checks if a service is defined.
         */
        has(id: string | symbol | Function): boolean;

        /**
         * Gets a service.
         */
        get(id: string | symbol | Function, invalidBehavior?: number): any;

        /**
         * Checks if a given service has been initialized.
         */
        initialized(id: string | symbol | Function): boolean;

        /**
         * Executes all the shutdown functions.
         */
        shutdown(): Promise<any[]>;

        /**
         * Resets the container.
         */
        reset(): Promise<void>;

        /**
         * Gets all service ids.
         */
        getServiceIds(): string[];

        /**
         * Register a function to call at shutdown.
         */
        registerShutdownCall(call: Invokable): void;

        /**
         * Normalizes a class definition (Function) to its class name.
         */
        static normalizeId(id: string | symbol | Function): string;

        /**
         * Underscorizes a string.
         */
        static underscore(id: string): string;

        /**
         * Camelizes a string.
         */
        static camelize(id: string): string;
    }
}
