const EnumStub = Jymfony.Component.VarDumper.Caster.EnumStub;

/**
 * Represents a single backtrace frame.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class FrameStub extends EnumStub {
    /**
     * Constructor.
     *
     * @param {Object.<string, string>} frame
     * @param {boolean} [inTraceStub = false]
     */
    __construct(frame, inTraceStub = false) {
        super.__construct(frame);

        /**
         * @type {boolean}
         */
        this.inTraceStub = inTraceStub;
    }
}
