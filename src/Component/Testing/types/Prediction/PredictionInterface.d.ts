declare namespace Jymfony.Component.Testing.Prediction {
    import Call = Jymfony.Component.Testing.Call.Call;
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class PredictionInterface implements MixinInterface {
        public static readonly definition: Newable<PredictionInterface>;

        /**
         * Tests that double fulfilled prediction.
         *
         * @throws {Jymfony.Component.Testing.Exception.ExceptionInterface}
         */
        check(calls: Call[], object: ObjectProphecy, method: MethodProphecy): void;
    }
}
