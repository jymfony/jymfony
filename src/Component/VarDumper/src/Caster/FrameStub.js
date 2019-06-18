const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * Represents a single backtrace frame.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
class FrameStub extends Stub {
    /**
     * Constructor.
     *
     * @param {Object.<string, string>} frame
     */
    __construct(frame) {
        super.__construct();

        /**
         * @type {Object<string, string>}
         */
        this.value = frame;
    }
}

module.exports = FrameStub;
