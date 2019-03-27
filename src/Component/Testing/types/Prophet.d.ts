declare namespace Jymfony.Component.Testing {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class Prophet {
        private _prophecies: ObjectProphecy[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Creates new object prophecy.
         */
        prophesize(classOrInterface?: string | undefined): ObjectProphecy;

        /**
         * Checks all predictions defined by prophecies of this Prophet.
         *
         * @throws {Jymfony.Component.Testing.Exception.Prediction.AggregateException} If any prediction fails
         */
        checkPredictions(): void;
    }
}
