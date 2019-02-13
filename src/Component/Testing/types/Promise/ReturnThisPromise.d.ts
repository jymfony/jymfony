declare namespace Jymfony.Component.Testing.Promise {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class ReturnThisPromise extends implementationOf(PromiseInterface) {
        /**
         * @inheritdoc
         */
        execute(args: any[], object: ObjectProphecy): any;
    }
}
