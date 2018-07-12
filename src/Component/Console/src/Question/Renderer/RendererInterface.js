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

module.exports = getInterface(RendererInterface);
