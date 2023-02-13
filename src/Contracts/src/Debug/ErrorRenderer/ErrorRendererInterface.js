/**
 * Formats an exception to be used as response content.
 *
 * @memberOf Jymfony.Contracts.Debug.ErrorRenderer
 */
class ErrorRendererInterface {
    /**
     * Renders an Error as a FlattenException.
     *
     * @param {Error} exception
     *
     * @returns {Jymfony.Contracts.Debug.Exception.FlattenExceptionInterface}
     */
    render(exception) { }
}

export default getInterface(ErrorRendererInterface);
