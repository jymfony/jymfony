declare namespace Jymfony.Component.Templating.Engine {
    import TemplateNameParser = Jymfony.Component.Templating.TemplateNameParser;
    import LoaderInterface = Jymfony.Component.Templating.Loader.LoaderInterface;
    import HelperInterface = Jymfony.Component.Templating.Helper.HelperInterface;
    import TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;

    /**
     * JsEngine is an engine able to render JS templates.
     */
    export class JsEngine extends implementationOf(EngineInterface) {
        private _parser: TemplateNameParser;
        private _loader: LoaderInterface;
        private _helpers: Record<string, HelperInterface>;
        private _globals: Record<string, any>;
        private _escapers: Record<string, Invokable<string>>;

        /**
         * Constructor.
         *
         * @param parser A TemplateNameParserInterface instance
         * @param loader A loader instance
         * @param [helpers = {}] An object containing helper instances
         */
        __construct(parser: TemplateNameParser, loader: LoaderInterface, helpers?: Record<string, HelperInterface>): void;
        constructor(parser: TemplateNameParser, loader: LoaderInterface, helpers?: Record<string, HelperInterface>);

        /**
         * @inheritdoc
         */
        exists(name: string): Promise<boolean>;

        /**
         * @inheritdoc
         */
        supports(name: string): boolean;

        /**
         * Gets a copy of the helpers map.
         */
        public readonly helpers: Record<string, HelperInterface>;

        /**
         * Gets a copy of the escapers map.
         */
        public readonly escapers: Record<string, Invokable<string>>;

        /**
         * Adds some helpers.
         *
         * @param helpers An object containing helper instances
         */
        addHelpers(helpers: Record<string, HelperInterface>): void;

        /**
         * Sets the helpers.
         *
         * @param helpers An object containing helper instances
         */
        setHelpers(helpers: Record<string, HelperInterface>): void;

        /**
         * Sets a helper.
         *
         * @param helper The helper instance
         * @param alias An alias
         */
        set(helper: HelperInterface, alias?: string): void;

        /**
         * Initializes the built-in escapers.
         *
         * Each function specifies a way for applying a transformation to a string
         * passed to it. The purpose is for the string to be "escaped" so it is
         * suitable for the format it is being displayed in.
         *
         * For example, the string: "It's required that you enter a username & password.\n"
         * If this were to be displayed as HTML it would be sensible to turn the
         * ampersand into '&amp;' and the apostrophe into '&aps;'. However if it were
         * going to be used as a string in JavaScript to be displayed in an alert box
         * it would be right to leave the string as-is, but c-escape the apostrophe and
         * the new line.
         */
        protected _initializeEscapers(): void;

        /**
         * @inheritdoc
         */
        render(out: NodeJS.WritableStream, name: string | TemplateReferenceInterface, parameters?: Record<string, any>): Promise<void>;

        /**
         * Loads the given template.
         *
         * @param name A template name or a TemplateReferenceInterface instance
         *
         * @throws {InvalidArgumentException} if the template cannot be found
         */
        load(name: string | TemplateReferenceInterface): Promise<TemplateInterface>;
    }
}
