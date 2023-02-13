/**
 * Wraps an error to be able to serialize it.
 *
 * @memberOf Jymfony.Contracts.Debug.Exception
 */
class FlattenExceptionInterface {
    toArray() { }

    /**
     * Gets all the previous exceptions.
     */
    get allPrevious() { }

    /**
     * Sets the string representation of the exception.
     *
     * @param {null|string} asString
     */
    set asString(asString) { }

    /**
     * Gets the string representation of the exception.
     *
     * @returns {string}
     */
    get asString() { }
}

export default getInterface(FlattenExceptionInterface);
