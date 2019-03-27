declare namespace Jymfony.Component.Testing.Exception {
    import MethodProphecy = Jymfony.Component.Testing.Prophecy.MethodProphecy;

    export class UnexpectedCallsCountException extends UnexpectedCallsException {
        private _expectedCount: number;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, methodProphecy: MethodProphecy, count: number, calls: string[]): void;
        constructor(message: string, methodProphecy: MethodProphecy, count: number, calls: string[]);

        public readonly expectedCount: number;
    }
}
