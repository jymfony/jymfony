/**
 * Represents a template ready to be evaluated and written
 * to a valid stream.
 *
 * @memberOf Jymfony.Component.Templating.Template
 */
class TemplateInterface {
    /**
     * Renders a template.
     *
     * @param {stream.Writable} out Stream to write the rendered template into.
     * @param {Object.<string, *>} [parameters = {}] A set of parameters to pass to the template
     *
     * @throws {RuntimeException} if the template cannot be rendered
     *
     * @returns {Promise<void>}
     */
    async stream(out, parameters = {}) { }
}

module.exports = getInterface(TemplateInterface);
