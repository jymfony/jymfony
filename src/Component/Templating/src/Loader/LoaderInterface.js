/**
 * Represents a template loader.
 *
 * @memberOf Jymfony.Component.Templating.Loader
 */
class LoaderInterface {
    /**
     * Loads a template.
     *
     * @param {Jymfony.Component.Templating.TemplateReferenceInterface} template The template reference.
     *
     * @returns {Promise<Jymfony.Component.Templating.Template.TemplateInterface>}
     */
    async load(template) { }
}

export default getInterface(LoaderInterface);
