declare namespace Jymfony.Component.Templating.Loader {
    import TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;

    /**
     * Represents a template loader.
     */
    export class LoaderInterface {
        /**
         * Loads a template.
         */
        load(template: TemplateReferenceInterface): Promise<TemplateInterface>;
    }
}
