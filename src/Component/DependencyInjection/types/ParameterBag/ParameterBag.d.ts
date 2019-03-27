declare namespace Jymfony.Component.DependencyInjection.ParameterBag {
    export class ParameterBag {
        protected _params: Record<string, any>;
        protected _env: Record<string, any>;
        protected _resolved: boolean;

        /**
         * Whether is resolved or not.
         */
        readonly resolved: boolean;

        constructor(params?: Record<string, any>);
        __construct(params?: Record<string, any>);

        /**
         * Empties the parameter bag.
         */
        clear(): void;

        /**
         * Adds parameters to the parameter bag.
         */
        add(params: Record<string, any>, overwrite?: boolean): void;

        /**
         * Gets a copy of the parameters map.
         */
        all(): Record<string, any>;

        /**
         * Gets a parameter.
         */
        get(name: string): any;

        /**
         * Adds a parameter.
         */
        set(name: string, value: any): void;

        /**
         * Returns true if the specified parameter is defined.
         */
        has(name: string): boolean;

        /**
         * Removes a parameter.
         */
        remove(name: string): void;

        /**
         * Replaces parameter placeholders (%name%) by their values for all parameters.
         */
        resolve(): void;

        /**
         * Replaces parameter placeholders (%name%) by their values for all parameters.
         */
        resolveValue(value: any, resolveEnv?: boolean, resolving?: Set<string>): any;

        /**
         * Resolves parameters inside a string.
         */
        resolveString(value: any, resolveEnv: boolean, resolving: Set<string>): any;

        /**
         * Escapes parameter placeholders %.
         */
        escapeValue(value: any): any;

        /**
         * Unescapes parameter placeholders %.
         */
        unescapeValue(value: any): any;

        /**
         * Gets a parameter from the parameter list.
         */
        private _get(name: string, strictlyScalar?: boolean): any;
    }
}
