declare namespace Jymfony.Component.HttpServer.RequestParser {
    /**
     * @internal
     */
    export class ParameterBag {
        private _bag: Map<string, any>;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        set(key: string, value: any): void;

        get(key: string): any;

        toObject(): Record<string, any>;
    }
}
