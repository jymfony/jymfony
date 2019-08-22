const TemplateReference = Jymfony.Component.Templating.TemplateReference;
const TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

/**
 * TemplateNameParser parses the template name and converts
 * it to a TemplateReference.
 *
 * This implementation takes everything as the template name
 * and the extension for the engine.
 *
 * @memberOf Jymfony.Component.Templating
 */
export default class TemplateNameParser {
    /**
     * Convert a template name to a TemplateReferenceInterface instance.
     *
     * @param {string|Jymfony.Component.Templating.TemplateReferenceInterface} name A template name or a TemplateReferenceInterface instance
     *
     * @returns {Jymfony.Component.Templating.TemplateReferenceInterface} A template
     */
    parse(name) {
        if (name instanceof TemplateReferenceInterface) {
            return name;
        }

        const matches = name.match(/\.([^.]+)$/i);
        const engine = null !== matches ? matches[1] : undefined;

        return new TemplateReference(name, engine);
    }
}
