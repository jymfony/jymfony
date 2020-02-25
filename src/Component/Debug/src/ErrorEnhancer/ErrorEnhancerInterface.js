/**
 * @memberOf Jymfony.Component.Debug.ErrorEnhancer
 */
class ErrorEnhancerInterface {
    /**
     * Returns an Error instance if the class is able to improve the error, null otherwise.
     *
     * @param {Error} error
     *
     * @returns {Error}
     */
    enhance(error) { }
}

export default getInterface(ErrorEnhancerInterface);
