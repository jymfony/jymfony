declare namespace Jymfony.Component.Testing.Exception.Prediction {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class AggregateException extends mix(RuntimeException, PredictionException) {
        private _exceptions: PredictionException[];
        private objectProphecy: ObjectProphecy;

        /**
         * Constructor.
         */
        __construct(message: string): void;
        constructor(message: string);

        /**
         * Appends an exception.
         */
        append(exception: PredictionException & Error): void;

        public readonly exceptions: (PredictionException & Error)[];
    }
}
