declare namespace Jymfony.Component.Templating.Engine {
    import TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

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
     */
    export class EngineInterface implements MixinInterface {
        public static readonly definition: Newable<EngineInterface>;

        /**
         * Renders a template.
         *
         * @param out Stream to write the rendered template into.
         * @param name A template name or a TemplateReferenceInterface instance
         * @param [parameters = {}] A set of parameters to pass to the template
         *
         * @throws {RuntimeException} if the template cannot be rendered
         */
        render(out: NodeJS.WritableStream, name: string | TemplateReferenceInterface, parameters?: Record<string, any>): Promise<void>;

        /**
         * Returns true if the template exists.
         *
         * @param name A template name or a TemplateReferenceInterface instance
         *
         * @returns true if the template exists, false otherwise
         */
        exists(name: string | TemplateReferenceInterface): Promise<boolean>;

        /**
         * Returns true if this class is able to render the given template.
         *
         * @param name A template name or a TemplateReferenceInterface instance
         *
         * @returns true if this class supports the given template, false otherwise
         */
        supports(name: string | TemplateReferenceInterface): boolean;
    }
}
