declare namespace Jymfony.Component.Testing.Exception {
    export class MethodNotFoundException extends DoubleException {
        private _className: string;
        private _methodName: string;
        private _args: any[];

        /**
         * Constructor.
         */
        __construct(message: string, className: string, methodName: string, args?: any[]): void;
        constructor(message: string, className: string, methodName: string, args?: any[]);

        public readonly className: string;

        public readonly methodName: string;

        public readonly args: any[];
    }
}
