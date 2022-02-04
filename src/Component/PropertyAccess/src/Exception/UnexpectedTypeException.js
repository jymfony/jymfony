const RuntimeException = Jymfony.Contracts.PropertyAccess.Exception.RuntimeException;

/**
 * @memberOf Jymfony.Component.PropertyAccess.Exception
 */
export default class UnexpectedTypeException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {*} value
     * @param {Jymfony.Component.PropertyAccess.PropertyPath} propertyPath
     * @param {int} index
     */
    __construct(value, propertyPath, index) {
        super.__construct(
            'PropertyAccessor requires a graph of objects or arrays to operate on, ' +
            'but it found type "' + (typeof value) + '" while trying to traverse path "' +
            propertyPath.toString() + '" at property "' + propertyPath.getElement(index) + '".'
        );
    }
}
