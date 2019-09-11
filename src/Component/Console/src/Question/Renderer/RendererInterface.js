/**
 * An abstract renderer.
 *
 * @memberOf Jymfony.Component.Console.Question.Renderer
 *
 * @internal
 */
class RendererInterface {
    /**
     * Gets the promise resolve callback.
     *
     * @returns {Promise}
     */
    doAsk() { }
}

export default getInterface(RendererInterface);
