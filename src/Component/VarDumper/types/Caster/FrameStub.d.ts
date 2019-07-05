declare namespace Jymfony.Component.VarDumper.Caster {
    /**
     * Represents a single backtrace frame.
     */
    export class FrameStub extends EnumStub {
        public value: Record<string, string>;
        public inTraceStub: boolean;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(frame: Record<string, string>, inTraceStub?: boolean): void;
        constructor(frame: Record<string, string>, inTraceStub?: boolean);
    }
}
