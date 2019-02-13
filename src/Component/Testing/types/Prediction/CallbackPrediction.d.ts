declare namespace Jymfony.Component.Testing.Prediction {
    import Call = Jymfony.Component.Testing.Call.Call;
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class CallbackPrediction extends implementationOf(PredictionInterface) {
        private _callback: Function;

        /**
         * Constructor.
         */
        __construct(callback: Function): void;
        constructor(callback: Function);

        /**
         * @inheritdoc
         */
        check(calls: Call[], object: ObjectProphecy, method: MethodProphecy): any;
    }
}
