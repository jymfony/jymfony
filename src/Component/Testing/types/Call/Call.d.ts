declare namespace Jymfony.Component.Testing.Call {
    export class Call {
        private _methodName: string;
        private _args: any[];
        private _returnValue: any;
        private _exception: Error;
        private _file: string;
        private _line: number;

        /**
         * Constructor.
         */
        __construct(methodName: string, args: any[], returnValue: any, exception: Error | undefined, file: string, line: number): void;
        constructor(methodName: string, args: any[], returnValue: any, exception: Error | undefined, file: string, line: number);

        /**
         * Gets the called method name.
         */
        public readonly methodName: string;

        /**
         * Gets the passed arguments.
         */
        public readonly args: any[];

        /**
         * Gets the returned value.
         */
        public readonly returnValue: any;

        /**
         * Gets the thrown exception.
         */
        public readonly exception: Error | undefined;

        /**
         * Gets the callee filename.
         */
        public readonly file: string;

        /**
         * Gets the callee line number.
         */
        public readonly line: number;

        /**
         * Returns short notation for callee place.
         */
        public readonly callPlace: string;

        toString(): string;
    }
}
