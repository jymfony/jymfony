declare namespace Jymfony.Component.Testing.Prophecy {
    import ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
    import Call = Jymfony.Component.Testing.Call.Call;
    import CallCenter = Jymfony.Component.Testing.Call.CallCenter;
    import Doubler = Jymfony.Component.Testing.Double.Doubler;

    export class ObjectProphecy<T = any> extends implementationOf(ProphecyInterface) {
        private _doubler: Doubler;
        private _revealer: Revealer;
        private _callCenter: CallCenter;
        private _methodProphecies: Record<string | symbol, MethodProphecy[]>;

        /**
         * Constructor.
         */
        __construct(doubler?: Doubler, revealer?: Revealer, callCenter?: CallCenter): void;
        constructor(doubler?: Doubler, revealer?: Revealer, callCenter?: CallCenter);

        /**
         * Gets the registered method prophecies.
         */
        public readonly methodProphecies: Record<string | symbol, MethodProphecy[]>;

        /**
         * Gets the prophecy revealer.
         */
        public readonly revealer: Revealer;

        /**
         * Forces double to implement specific interface.
         */
        willImplement(Interface: Newable): this;

        /**
         * Forces double to extend specific class.
         */
        willExtend(Class: Newable): this;

        /**
         * Sets constructor arguments.
         */
        willBeConstructedWith(args: any[]): this;

        /**
         * Finds calls by method name & arguments wildcard.
         */
        findProphecyMethodCalls(methodName: string, wildcard: ArgumentsWildcard): Call[];

        /**
         * Makes specific method call.
         */
        makeProphecyMethodCall(methodName: string, args: any[]): any;

        /**
         * Register a method prophecy.
         */
        addMethodProphecy(methodProphecy: MethodProphecy): this;

        /**
         * Returns either all or related to single method prophecies.
         */
        getMethodProphecies(methodName?: string | undefined): MethodProphecy[];

        /**
         * Checks that registered method predictions do not fail.
         *
         * @throws {Jymfony.Component.Testing.Exception.Prediction.AggregateException} If any of registered predictions fail
         */
        checkProphecyMethodsPredictions(): void;

        /**
         * @inheritdoc
         */
        reveal(): T;

        /**
         * Calculates the prophecy (friendly) name.
         */
        public readonly name: string;
    }
}
