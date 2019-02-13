declare namespace Jymfony.Component.Testing.Prediction {
    import Call = Jymfony.Component.Testing.Call.Call;
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class CallTimesPrediction extends implementationOf(PredictionInterface) {
        private _times: number;

        /**
         * Constructor.
         */
        __construct(times: number): void;
        constructor(times: number);

        /**
         * @inheritdoc
         */
        check(calls: Call[], object: ObjectProphecy, method: MethodProphecy): void;
    }
}
