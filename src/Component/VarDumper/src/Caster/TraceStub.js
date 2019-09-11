const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * Represents a backtrace as returned by Error stack.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class TraceStub extends Stub {
    /**
     * Constructor.
     *
     * @param {Object.<string, string>[]} trace
     * @param {int} sliceOffset
     * @param {int} sliceLength
     * @param {int} numberingOffset
     */
    __construct(trace, sliceOffset = 0, sliceLength = undefined, numberingOffset = 0) {
        super.__construct();

        /**
         * @type {Object<string, string>[]}
         */
        this.value = trace;

        /**
         * @type {int}
         */
        this.sliceOffset = sliceOffset;

        /**
         * @type {int|undefined}
         */
        this.sliceLength = sliceLength;

        /**
         * @type {int}
         */
        this.numberingOffset = numberingOffset;
    }
}
