/**
 * Represents a template loader.
 *
 * @memberOf Jymfony.Component.Templating.Loader
 */
class LoaderInterface {
    /**
     * Loads a template.
     *
     * @param {Jymfony.Component.Templating.TemplateReferenceInterface} name The template reference.
     *
     * @returns {Promise<Jymfony.Component.Templating.Template.TemplateInterface>}
     */
    async load(name) { }
}

module.exports = getInterface(LoaderInterface);
