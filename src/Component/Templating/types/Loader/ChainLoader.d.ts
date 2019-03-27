declare namespace Jymfony.Component.Templating.Loader {
    import TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
    import LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;

    /**
     * Represents a chain loader.
     */
    export class ChainLoader extends implementationOf(LoaderInterface, LoggerAwareInterface, LoggerAwareTrait) {
        protected _logger: LoggerInterface;
        private _loaders: LoaderInterface[];

        /**
         * Constructor.
         *
         * @param [loaders=[]] An array of loader instances
         */
        __construct(loaders?: LoaderInterface[]): void;
        constructor(loaders?: LoaderInterface[]);

        /**
         * Adds a loader instance.
         *
         * @param {Jymfony.Component.Templating.Loader.LoaderInterface} loader
         */
        addLoader(loader: LoaderInterface): void;

        /**
         * @inheritdoc
         */
        load(template: TemplateReferenceInterface): Promise<TemplateInterface>;
    }
}
