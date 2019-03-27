declare namespace Jymfony.Component.Testing.Exception {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class UnexpectedCallException extends ObjectProphecyException {
        private _methodName: string;
        private _args: any[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, objectProphecy: ObjectProphecy, methodName: string, args: any[]): void;
        constructor(message: string, objectProphecy: ObjectProphecy, methodName: string, args: any[]);

        public readonly methodName: string;

        public readonly args: any[];
    }
}
