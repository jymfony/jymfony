declare namespace Jymfony.Component.Templating {
    /**
     * Internal representation of a template.
     */
    export class TemplateReference extends implementationOf(TemplateReferenceInterface) {
        private _parameters: Record<string, any>;

        /**
         * Constructor.
         *
         * @param [name] The logical name of the template
         * @param [engine] The name of the engine
         */
        __construct(name?: string, engine?: string): void;
        constructor(name?: string, engine?: string);

        /**
         * @inheritdoc
         */
        all(): Record<string, any>;

        /**
         * @inheritdoc
         */
        set(name: string, value: any): this;

        /**
         * @inheritdoc
         */
        get(name: string): any;

        /**
         * @inheritdoc
         */
        public readonly name: string;

        /**
         * @inheritdoc
         */
        toString(): string;
    }
}
