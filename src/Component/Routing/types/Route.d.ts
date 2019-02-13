declare namespace Jymfony.Component.Routing {
    /**
     * A Route describes a route and its parameters.
     */
    export class Route {
        private _path: string;
        private _compiled: CompiledRoute;
        private _host: string;
        private _schemes: string[];
        private _methods: string[];
        private _options: Record<string, any>;
        private _defaults: Record<string, any>;
        private _requirements: Record<string, RegExp>;

        /**
         * Constructor.
         */
        __construct(path: string, defaults?: Record<string, any>, requirements?: Record<string, string>, options?: Record<string, any>, host?: string | undefined, schemes?: string[], methods?: string[], condition?: string): void;
        constructor(path: string, defaults?: Record<string, any>, requirements?: Record<string, string>, options?: Record<string, any>, host?: string | undefined, schemes?: string[], methods?: string[], condition?: string);

        /**
         * Gets the pattern for the path.
         */
        public readonly path: string;

        /**
         * Sets the pattern for the path.
         */
        setPath(path: string): Route;

        /**
         * Gets the pattern for the host.
         */
        public readonly host: string;

        /**
         * Sets the pattern for the host.
         */
        setHost(host: string): Route;

        /**
         * Returns the lowercased schemes this route is restricted to.
         * So an empty array means that any scheme is allowed.
         */
        public readonly schemes: string[];

        /**
         * Sets the schemes (e.g. 'https') this route is restricted to.
         * So an empty array means that any scheme is allowed.
         */
        setSchemes(schemes: string[]): Route;

        /**
         * Checks if a scheme requirement has been set.
         */
        hasScheme(scheme: string): boolean;

        /**
         * Returns the uppercased HTTP methods this route is restricted to.
         */
        public readonly methods: string[];

        /**
         * Sets the methods (e.g. 'POST') this route is restricted to.
         * An empty array is not allowed.
         */
        setMethods(methods: string[]): Route;

        /**
         * Returns the options.
         */
        public readonly options: Record<string, any>;

        /**
         * Sets the options.
         */
        setOptions(options: Record<string, any>): Route;

        /**
         * Adds options.
         */
        addOptions(options: Record<string, any>): Route;

        /**
         * Sets an option value.
         */
        setOption(name: string, value: any): Route;

        /**
         * Gets an option value.
         */
        getOption(name: string): any;

        /**
         * Checks if an option has been set.
         */
        hasOption(name: string): boolean;

        /**
         * Returns the defaults.
         */
        public readonly defaults: Record<string, any>;

        /**
         * Sets the defaults.
         */
        setDefaults(defaults: Record<string, any>): Route;

        /**
         * Adds defaults.
         */
        addDefaults(defaults: Record<string, any>): Route;

        /**
         * Sets a default value.
         */
        setDefault(name: string, value: any): Route;

        /**
         * Gets a default value.
         *
         * @param {string} name
         *
         * @returns {*}
         */
        getDefault(name: string): any;

        /**
         * Checks if a default value has been set.
         *
         * @param {string} name
         *
         * @returns {boolean}
         */
        hasDefault(name: string): boolean;

        /**
         * Sets the route condition.
         *
         * @TODO To be implemented
         */
        setCondition(condition: string): Route;

        /**
         * Gets the condition for this route.
         */
        public readonly condition?: string;

        /**
         * Gets the requirements.
         */
        public readonly requirements: Record<string, RegExp>;

        /**
         * Sets the requirements.
         */
        setRequirements(requirements: Record<string, string | RegExp> | string[] | RegExp[]): Route;

        /**
         * Add requirements.
         */
        addRequirements(requirements: Record<string, string | RegExp> | string[] | RegExp[]): Route;

        /**
         * Gets a requirement by key.
         */
        getRequirement(key: string): RegExp | undefined;

        /**
         * Checks if a requirement for key has been set.
         */
        hasRequirement(key: string): boolean;

        /**
         * Sets a requirement.
         */
        setRequirement(key: string, regex: string | RegExp): Route;

        /**
         * Compiles the route.
         */
        compile(): CompiledRoute;

        /**
         * Sanitize a requirement.
         */
        private _sanitizeRequirement(key: string, regex: string | RegExp): RegExp;
    }
}
