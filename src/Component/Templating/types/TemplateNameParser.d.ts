declare namespace Jymfony.Component.Templating {
    /**
     * TemplateNameParser parses the template name and converts
     * it to a TemplateReference.
     *
     * This implementation takes everything as the template name
     * and the extension for the engine.
     */
    export class TemplateNameParser {
        /**
         * Convert a template name to a TemplateReferenceInterface instance.
         *
         * @param name A template name or a TemplateReferenceInterface instance
         *
         * @returns A template
         */
        parse(name: string | TemplateReferenceInterface): TemplateReferenceInterface;
    }
}
