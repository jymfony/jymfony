declare namespace Jymfony.Component.Testing.Promise {
    export class ReturnPromise extends implementationOf(PromiseInterface) {
        private _returnValues: any[];

        /**
         * Constructor.
         */
        __construct(returnValues?: any[]): void;
        constructor(returnValues?: any[]);

        /**
         * @inheritdoc
         */
        execute(): any;
    }
}
