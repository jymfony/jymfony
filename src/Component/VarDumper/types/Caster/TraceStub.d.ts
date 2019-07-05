declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    /**
     * Represents a backtrace as returned by Error stack.
     */
    export class TraceStub extends Stub {
        public value: Record<string, string>[];
        public sliceOffset: number;
        public sliceLength: number|undefined;
        public numberingOffset: number;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(trace: Record<string, string>[], sliceOffset?: number, sliceLength?: number, numberingOffset?: number): void;
        constructor(trace: Record<string, string>[], sliceOffset?: number, sliceLength?: number, numberingOffset?: number);
    }
}
