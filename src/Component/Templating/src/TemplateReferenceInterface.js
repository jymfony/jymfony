/**
 * Interface to be implemented by all templates.
 *
 * @memberOf Jymfony.Component.Templating
 */
class TemplateReferenceInterface {
    /**
     * Gets the template parameters.
     *
     * @returns {Object.<string, *>} A set of parameters
     */
    all() { }

    /**
     * Sets a template parameter.
     *
     * @param {string} name The parameter name
     * @param {string} value The parameter value
     *
     * @returns {Jymfony.Component.Templating.TemplateReferenceInterface}
     *
     * @throws {InvalidArgumentException} if the parameter name is not supported
     */
    set(name, value) { }

    /**
     * Gets a template parameter.
     *
     * @param {string} name The parameter name
     *
     * @returns {string} The parameter value
     *
     * @throws {InvalidArgumentException} if the parameter name is not supported
     */
    get(name) { }

    /**
     * Returns the "logical" template name.
     *
     * The template name acts as a unique identifier for the template.
     *
     * @returns {string} The template name
     */
    get name() { }

    /**
     * Returns the string representation as shortcut for name getter.
     *
     * @returns {string} The template name
     */
    toString() { }
}

module.exports = getInterface(TemplateReferenceInterface);
