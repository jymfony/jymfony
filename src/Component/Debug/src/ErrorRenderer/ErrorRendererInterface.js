/**
 * Formats an exception to be used as response content.
 *
 * @memberOf Jymfony.Component.Debug.ErrorRenderer
 */
class ErrorRendererInterface {
    /**
     * Renders an Error as a FlattenException.
     *
     * @param {Error} exception
     *
     * @returns {Jymfony.Component.Debug.Exception.FlattenException}
     */
    render(exception) { }
}

export default getInterface(ErrorRendererInterface);
