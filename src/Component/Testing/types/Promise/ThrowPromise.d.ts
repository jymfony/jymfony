declare namespace Jymfony.Component.Testing.Promise {
    export class ThrowPromise extends implementationOf(PromiseInterface) {
        private _exception: Error;

        /**
         * Constructor.
         */
        __construct(exception: Error): void;
        constructor(exception: Error);

        /**
         * @inheritdoc
         */
        execute(): never;
    }
}
