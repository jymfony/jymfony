/**
 * EngineInterface is the interface each engine must implement.
 *
 * All methods rely on a template name. A template name is a
 * "logical" name for the template, and as such it does not refer to
 * a path on the filesystem (in fact, the template can be stored
 * anywhere, like in a database).
 *
 * The methods should accept any name.
 *
 * Each template loader uses the logical template name to look for
 * the template.
 *
 * @memberOf Jymfony.Component.Templating
 */
class EngineInterface {
    /**
     * Renders a template.
     *
     * @param {stream.Writable} out Stream to write the rendered template into.
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     * @param {Object.<string, *>} [parameters = {}] A set of parameters to pass to the template
     *
     * @throws {RuntimeException} if the template cannot be rendered
     *
     * @returns {Promise<void>}
     */
    async render(out, name, parameters = {}) { }

    /**
     * Returns true if the template exists.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     *
     * @returns {Promise<boolean>} true if the template exists, false otherwise
     *
     * @throws {RuntimeException} if the engine cannot handle the template name
     */
    async exists(name) { }

    /**
     * Returns true if this class is able to render the given template.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     *
     * @returns {boolean} true if this class supports the given template, false otherwise
     */
    supports(name) { }
}

module.exports = getInterface(EngineInterface);
