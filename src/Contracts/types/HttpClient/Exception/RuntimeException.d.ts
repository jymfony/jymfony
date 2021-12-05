declare namespace Jymfony.Contracts.HttpClient.Exception {
    import ExceptionInterface = Jymfony.Contracts.HttpClient.Exception.ExceptionInterface;
    import ResponseInterface = Jymfony.Contracts.HttpClient.ResponseInterface;

    /**
     * @internal
     */
    export class RuntimeException extends mix(global.RuntimeException, ExceptionInterface) {
        private _response: ResponseInterface;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(response: ResponseInterface): void;
        constructor(response: ResponseInterface);

        public readonly response: ResponseInterface;
    }
}
