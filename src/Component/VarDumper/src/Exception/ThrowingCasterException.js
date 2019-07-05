/**
 * @memberOf Jymfony.Component.VarDumper.Exception
 */
class ThrowingCasterException extends Exception {
    /**
     * Constructor.
     *
     * @param {Error} previous
     */
    __construct(previous = undefined) {
        const class_ = new ReflectionClass(previous);
        super.__construct(__jymfony.sprintf('Unexpected %s thrown from a caster: %s',
            class_.name || class_.getConstructor().name,
            previous.message || '<no message>'), 0, previous);
    }
}

module.exports = ThrowingCasterException;
