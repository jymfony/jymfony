declare namespace Jymfony.Component.Testing.Promise {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class CallbackPromise extends implementationOf(PromiseInterface) {
        private _callback: Function;

        /**
         * Constructor.
         */
        __construct(callback: Function): void;
        constructor(callback: Function);

        /**
         * @inheritdoc
         */
        execute(args: any[], object: ObjectProphecy): any;
    }
}
