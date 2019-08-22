import { isAbsolute } from 'path';

const Filesystem = Jymfony.Component.Filesystem.Filesystem;
const LoaderInterface = Jymfony.Component.Templating.Loader.LoaderInterface;
const LoggerAwareInterface = Jymfony.Component.Logger.LoggerAwareInterface;
const LoggerAwareTrait = Jymfony.Component.Logger.LoggerAwareTrait;
const NullLogger = Jymfony.Component.Logger.NullLogger;
const JsTemplate = Jymfony.Component.Templating.Template.JsTemplate;

/**
 * Template loader.
 *
 * @memberOf Jymfony.Component.Templating.Loader
 */
export default class Loader extends implementationOf(LoaderInterface, LoggerAwareInterface, LoggerAwareTrait) {
    /**
     * Constructor.
     *
     * @param {string|string[]} templatePathPatterns An array of path patterns to look for templates
     */
    __construct(templatePathPatterns) {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._templatePathPatterns = ! isArray(templatePathPatterns) ? [ templatePathPatterns ] : templatePathPatterns;

        /**
         * @type {Jymfony.Component.Filesystem.Filesystem}
         *
         * @private
         */
        this._filesystem = new Filesystem();
        this._logger = new NullLogger();
    }

    /**
     * @inheritdoc
     *
     * @param {Jymfony.Component.Templating.TemplateReferenceInterface} template The template reference.
     */
    async load(template) {
        let file = template.name;

        if (isAbsolute(file) && await this._filesystem.isFile(file)) {
            return new JsTemplate(file);
        }

        const replacements = {};
        for (const [ key, value ] of __jymfony.getEntries(template.all())) {
            replacements['%' + key + '%'] = value;
        }

        const fileFailures = [];
        for (const pattern of this._templatePathPatterns) {
            if (await this._filesystem.isFile(file = __jymfony.strtr(pattern, replacements)) &&
                await this._filesystem.isReadable(file)) {
                this._logger.debug('Loaded template file.', { file });

                return new JsTemplate(file);
            }

            fileFailures.push(file);
        }

        // Only log failures if no template could be loaded at all
        for (const file of fileFailures) {
            this._logger.debug('Failed loading template file.', { file });
        }

        throw new RuntimeException(__jymfony.sprintf('Cannot load template "%s"', template.name));
    }
}
