declare namespace Jymfony.Component.Templating.Engine {
    import TemplateReferenceInterface = Jymfony.Component.Templating.TemplateReferenceInterface;

    /**
     * DelegatingEngine selects an engine for a given template.
     */
    export class DelegatingEngine extends implementationOf(EngineInterface) {
        protected _engines: EngineInterface[];

        /**
         * Constructor.
         *
         * @param [engines=[]] An array of EngineInterface instances to add
         */
        __construct(engines?: EngineInterface[]): void;
        constructor(engines?: EngineInterface[]);

        /**
         * Adds an engine.
         */
        addEngine(engine: EngineInterface): void;

        /**
         * @inheritdoc
         */
        render(out: NodeJS.WritableStream, name: string | TemplateReferenceInterface, parameters?: Record<string, any>): Promise<void>;

        /**
         * @inheritdoc
         */
        exists(name: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        supports(name: string): boolean;

        /**
         * Get an engine able to render the given template.
         *
         * @param name A template name or a TemplateReferenceInterface instance
         *
         * @returns The engine
         *
         * @throws {RuntimeException} if no engine able to work with the template is found
         */
        getEngine(name: string | TemplateReferenceInterface): EngineInterface;
    }
}
