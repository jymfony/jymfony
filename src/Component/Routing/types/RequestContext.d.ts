declare namespace Jymfony.Component.Routing {
    export class RequestContext {
        public method: string;
        public host: string;
        public scheme: string;
        public httpPort: number;
        public httpsPort: number;
        public path: string;
        public queryString: string;
        private _parameters: Record<string, any>;

        /**
         * Constructor.
         */
        __construct(method?: string, host?: string, scheme?: string, httpPort?: number, httpsPort?: number, path?: string, queryString?: string): void;
        constructor(method?: string, host?: string, scheme?: string, httpPort?: number, httpsPort?: number, path?: string, queryString?: string);

        /**
         * Gets/sets the parameters.
         */
        public parameters: Record<string, any>;

        /**
         * Gets a parameter value.
         *
         * @param name A parameter name
         *
         * @returns The parameter value or null if nonexistent
         */
        getParameter(name: string): any;

        /**
         * Checks if a parameter value is set for the given parameter.
         *
         * @param name A parameter name
         *
         * @returns True if the parameter value is set, false otherwise
         */
        hasParameter(name: string): boolean;

        /**
         * Sets a parameter value.
         *
         * @param name A parameter name
         * @param parameter The parameter value
         */
        setParameter(name: string, parameter: any): this;
    }
}
