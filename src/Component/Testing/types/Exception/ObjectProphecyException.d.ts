declare namespace Jymfony.Component.Testing.Exception {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class ObjectProphecyException extends mix(RuntimeException, ExceptionInterface) {
        private _objectProphecy: ObjectProphecy;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, objectProphecy: ObjectProphecy): void;
        constructor(message: string, objectProphecy: ObjectProphecy);

        public readonly objectProphecy: ObjectProphecy;
    }
}
