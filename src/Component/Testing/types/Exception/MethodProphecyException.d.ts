declare namespace Jymfony.Component.Testing.Exception {
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;

    export class MethodProphecyException extends ObjectProphecyException {
        private _methodProphecy: MethodProphecy;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, methodProphecy: MethodProphecy): void;
        constructor(message: string, methodProphecy: MethodProphecy);

        public readonly methodProphecy: MethodProphecy;
    }
}
