/**
 * An abstract renderer.
 *
 * @internal
 * @memberOf Jymfony.Component.Console.Question.Renderer
 */
class RendererInterface {
    /**
     * Gets the promise resolve callback.
     *
     * @returns {Promise}
     */
    doAsk() { }
}

module.exports = getInterface(RendererInterface);
