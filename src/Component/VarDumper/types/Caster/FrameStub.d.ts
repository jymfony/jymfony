declare namespace Jymfony.Component.VarDumper.Caster {
    import Stub = Jymfony.Component.VarDumper.Cloner.Stub;

    /**
     * Represents a single backtrace frame.
     */
    export class FrameStub extends Stub {
        public value: Record<string, string>;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(frame: Record<string, string>): void;
        constructor(frame: Record<string, string>);
    }
}
