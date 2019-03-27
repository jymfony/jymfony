declare namespace Jymfony.Component.Testing.Call {
    import ArgumentsWildcard = Jymfony.Component.Testing.Argument.ArgumentsWildcard;
    import UnexpectedCallException = Jymfony.Component.Testing.Exception.UnexpectedCallException;
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class CallCenter {
        private _recordedCalls: Call[];

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Makes and records specific method call for object prophecy.
         *
         * @returns Returns undefined if no promise for prophecy found or promise return value.
         *
         * @throws {Jymfony.Component.Testing.Exception.UnexpectedCallException} If no appropriate method prophecy found
         */
        makeCall(prophecy: ObjectProphecy, methodName: string, args: any[]): any;

        /**
         * Searches for calls by method name & arguments wildcard.
         */
        findCalls(methodName: string, wildcard: ArgumentsWildcard): Call[];

        /**
         * Creates an unexpected call exception.
         */
        createUnexpectedCallException(prophecy: ObjectProphecy, methodName: string, args: any[]): UnexpectedCallException;
    }
}
