declare namespace Jymfony.Component.Routing.Annotation {
    export interface RouteOptions {
        path: string | Record<string, string>,
        name?: string,
        requirements?: Record<string, string>,
        options?: Record<string, string>,
        defaults?: Record<string, string>,
        host?: string,
        methods?: string[],
        schemes?: string[],
        condition?: string,
        locale?: string,
        format?: string,
    }

    export class Route {
        private _localizedPaths?: Record<string, string>;
        private _path?: string;
        private _name?: string;
        private _requirements?: Record<string, string>;
        private _options?: Record<string, string>;
        private _defaults?: Record<string, string>;
        private _host?: string;
        private _methods?: string[];
        private _schemes?: string[];
        private _condition?: string;
        private _locale?: string;
        private _format?: string;

        /**
         * Route annotation.
         *
         * @param {object} options
         * @param {string | Object.<string, string>} options.path
         * @param {string} [options.name]
         * @param {Object.<string, string>} [options.requirements = {}]
         * @param {Object.<string, string>} [options.options = {}]
         * @param {Object.<string, string>} [options.defaults = {}]
         * @param {string} [options.host]
         * @param {string[]} [options.methods = ['GET', 'POST']]
         * @param {string[]} [options.schemes = ['http', 'https']]
         * @param {string} [options.condition]
         * @param {string} [options.locale]
         * @param {string} [options.format]
         */
        __construct(options: RouteOptions): void;
        constructor(options: RouteOptions);

        public readonly path: string;
        public readonly localizedPaths: undefined | Record<string, string>;
        public readonly name: undefined | string;
        public readonly requirements: undefined | Record<string, string>;
        public readonly options: undefined | Record<string, string>;
        public readonly defaults: undefined | Record<string, string>;
        public readonly host: undefined | string;
        public readonly methods: undefined | string[];
        public readonly schemes: undefined | string[];
        public readonly condition: undefined | string;
    }
}
