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
        super.__construct('Unexpected ' + ReflectionClass.getClassName(previous) + ' thrown from a caster: ' + previous.message, 0, previous);
    }
}

module.exports = ThrowingCasterException;
