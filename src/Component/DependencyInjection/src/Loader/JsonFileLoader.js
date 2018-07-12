const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;

const path = require('path');

/**
 * JsonFileLoader loads configurations from a JSON file.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
class JsonFileLoader extends FileLoader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container A ContainerBuilder instance
     * @param {Jymfony.Component.Config.FileLocatorInterface} locator A FileLocator instance
     */
    __construct(container, locator) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @private
         */
        this._container = container;

        super.__construct(locator);
    }

    /**
     * @inheritdoc
     */
    load(resource) {
        const filePath = this._locator.locate(resource);
        this.currentDir = path.dirname(filePath);
        this._container.addResource(new FileResource(filePath));

        const content = require(filePath);
        this._loadFromExtensions(content);
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = undefined) {
        if (! isString(resource)) {
            return false;
        }

        if (undefined === type && '.json' === path.extname(resource)) {
            return true;
        }

        return 'json' === type;
    }

    /**
     * @param {string} content
     *
     * @private
     */
    _loadFromExtensions(content) {
        for (const [ name, values ] of __jymfony.getEntries(content)) {
            if (0 < [ 'imports', 'parameters', 'services' ].indexOf(name)) {
                continue;
            }

            this._container.loadFromExtension(name, values);
        }
    }
}

module.exports = JsonFileLoader;
