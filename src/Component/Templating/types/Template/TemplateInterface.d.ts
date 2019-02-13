declare namespace Jymfony.Component.Templating.Template {
    /**
     * Represents a template ready to be evaluated and written
     * to a valid stream.
     */
    export class TemplateInterface implements MixinInterface {
        public static readonly definition: Newable<TemplateInterface>;

        /**
         * Renders a template.
         *
         * @param out Function that streams out data from rendered template.
         * @param [parameters = {}] A set of parameters to pass to the template
         *
         * @throws {RuntimeException} if the template cannot be rendered
         */
        stream(out: AsyncFunction, parameters?: Record<string, any>): Promise<void>;
    }
}
