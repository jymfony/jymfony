declare namespace Jymfony.Component.Templating.Loader {
    import LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;
    import LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
    import Filesystem = Jymfony.Component.Filesystem.Filesystem;
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;
    import TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;

    /**
     * Template loader.
     */
    export class Loader extends implementationOf(LoaderInterface, LoggerAwareInterface, LoggerAwareTrait) {
        private _templatePathPatterns: string[];
        private _filesystem: Filesystem;
        private _logger: LoggerInterface;

        /**
         * Constructor.
         *
         * @param {string|string[]} templatePathPatterns An array of path patterns to look for templates
         */
        __construct(templatePathPatterns: string | string[]): void;
        constructor(templatePathPatterns: string | string[]);

        /**
         * @inheritdoc
         */
        load(template: TemplateReferenceInterface): Promise<TemplateInterface>;
    }
}
