declare namespace Jymfony.Component.Testing.Framework.Exception {
    import AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;

    export class SyntheticException extends AssertionFailedException {
        protected _syntheticFile: string;
        protected _syntheticLine: number;
        protected _syntheticTrace: any[];

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, code: null | number, file: string, line: number, trace: any[]): void;
        constructor(message: string, code: null | number, file: string, line: number, trace: any[]);

        public readonly syntheticFile: string;
        public readonly syntheticLine: null | number;
        public readonly syntheticTrace: any[];
        public readonly stackTrace: any[];
    }
}
