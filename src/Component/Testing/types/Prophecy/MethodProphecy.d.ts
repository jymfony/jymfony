declare namespace Jymfony.Component.Testing.Prophecy {
    import ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
    import PredictionInterface = Jymfony.Component.Testing.Prediction.PredictionInterface;
    import PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

    export class MethodProphecy {
        private _objectProphecy: ObjectProphecy;
        private _methodName: string;
        private _args: any[] | undefined;
        private _prediction: PredictionInterface;
        private _checkedPredictions: PredictionInterface[];
        private _promise: PromiseInterface;
        private _bound: boolean;

        /**
         * Constructor.
         */
        __construct(objectProphecy: ObjectProphecy, methodName: string, args?: any[] | undefined): void;
        constructor(objectProphecy: ObjectProphecy, methodName: string, args?: any[] | undefined);

        /**
         * Gets the method name.
         */
        public readonly methodName: string;

        /**
         * Gets the arguments wildcard for this prophecy.
         */
        public readonly argumentsWildcard: ArgumentsWildcard | undefined;

        /**
         * Returns object prophecy this method prophecy is tied to.
         */
        public readonly objectProphecy: ObjectProphecy;

        /**
         * Gets the promise tied to this method prophecy.
         */
        public readonly promise: PromiseInterface | undefined;

        /**
         * Gets the checked predictions for this prophecy.
         */
        public readonly checkedPredictions: PredictionInterface[];

        /**
         * Sets argument wildcard.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         */
        withArguments(args: any[] | ArgumentsWildcard): this;

        /**
         * Sets custom promise to the prophecy.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         */
        will(promise: Function | PromiseInterface): this;

        /**
         * Sets return promise to the prophecy.
         */
        willReturn(...args: any[]): this;

        /**
         * Sets return argument promise to the prophecy.
         */
        willReturnArgument(index: number): this;

        /**
         * Sets return "this" (the object) promise to the prophecy.
         */
        willReturnThis(): this;

        /**
         * Sets throw promise to the prophecy.
         */
        willThrow(exception: Function | Error): this;

        /**
         * Sets custom prediction to the prophecy.
         *
         * @throws {Jymfony.Component.Testing.Prophecy.Exception.InvalidArgumentException}
         */
        should(prediction: Function | PredictionInterface): this;

        /**
         * Sets call prediction to the prophecy.
         */
        shouldBeCalled(): this;

        /**
         * Sets no calls prediction to the prophecy.
         */
        shouldNotBeCalled(): this;

        /**
         * Sets call times prediction to the prophecy.
         */
        shouldBeCalledTimes(count: number): this;

        /**
         * Checks provided prediction immediately.
         *
         * @throws {Jymfony.Component.Testing.Exception.InvalidArgumentException}
         */
        shouldHave(prediction: Function | PredictionInterface): this;

        /**
         * Checks call prediction.
         */
        shouldHaveBeenCalled(): this;

        /**
         * Checks no calls prediction.
         */
        shouldNotHaveBeenCalled(): this;

        /**
         * Checks call times prediction.
         */
        shouldHaveBeenCalledTimes(count: number): this;

        /**
         * Checks currently registered [with should(...)] prediction.
         */
        checkPrediction(): void;

        private _bindToObjectProphecy(): void;
    }
}
