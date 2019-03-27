declare namespace Jymfony.Component.Testing.Prediction {
    import Call = Jymfony.Component.Testing.Call.Call;
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class NoCallsPrediction extends implementationOf(PredictionInterface) {
        /**
         * @inheritdoc
         */
        check(calls: Call[], object: ObjectProphecy, method: MethodProphecy): void;
    }
}
