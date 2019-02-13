declare namespace Jymfony.Component.Templating {
    /**
     * Internal representation of a template.
     */
    export class TemplateReferenceInterface implements MixinInterface {
        public static readonly definition: Newable<TemplateReferenceInterface>;

        /**
         * Gets the template parameters.
         *
         * @returns A set of parameters
         */
        all(): Record<string, any>;

        /**
         * Sets a template parameter.
         *
         * @throws {InvalidArgumentException} if the parameter name is not supported
         */
        set(name: string, value: any): this;

        /**
         * Gets a template parameter.
         *
         * @throws {InvalidArgumentException} if the parameter name is not supported
         */
        get(name: string): any;

        /**
         * Returns the "logical" template name.
         *
         * The template name acts as a unique identifier for the template.
         */
        public readonly name: string;

        /**
         * Returns the string representation as shortcut for name getter.
         */
        toString(): string;
    }
}
