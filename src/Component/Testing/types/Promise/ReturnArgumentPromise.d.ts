declare namespace Jymfony.Component.Testing.Promise {
    export class ReturnArgumentPromise extends implementationOf(PromiseInterface) {
        private _index: number;

        /**
         * Constructor.
         */
        __construct(index?: number): void;
        constructor(index?: number);

        /**
         * @inheritdoc
         */
        execute(args: any[]): any;
    }
}
