declare namespace Jymfony.Component.HttpFoundation {
    /**
     * Compares a pre-defined set of checks against a Request object.
     */
    export class RequestMatcher extends implementationOf(RequestMatcherInterface) {
        private _path?: string;

        private _host?: string;

        private _methods?: string[];

        private _ips: string[];

        private _attributes: Record<string, any>;

        private _schemes?: string[];

        /**
         * Constructor.
         */
        __construct(path?: string | undefined, host?: string | undefined, methods?: string | string[] | undefined, ips?: string[], attributes?: Record<string, any>, schemes?: string | string[] | undefined): void;
        constructor(path?: string | undefined, host?: string | undefined, methods?: string | string[] | undefined, ips?: string[], attributes?: Record<string, any>, schemes?: string | string[] | undefined);

        /**
         * @inheritdoc
         */
        matches(request: Request): boolean;
    }
}
