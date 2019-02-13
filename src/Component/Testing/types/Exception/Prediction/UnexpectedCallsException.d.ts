declare namespace Jymfony.Component.Testing.Exception.Prediction {
    import MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;

    export class UnexpectedCallsException extends mix(MethodProphecyException, PredictionException) {
        private _calls: string[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, methodProphecy: MethodProphecy, calls: string[]): void;
        constructor(message: string, methodProphecy: MethodProphecy, calls: string[]);

        public readonly calls: string[];
    }
}
