const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * JsFileLoader loads service definitions from a js file.
 *
 * The js file is required and the container variable can be
 * used within the file to change the container.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
class JsFileLoader extends FileLoader {
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
        const oldCWD = this.currentDir;

        const filePath = this._locator.locate(resource);
        this.currentDir = path.dirname(filePath);
        this._container.addResource(new FileResource(filePath));

        const code = '(function (container, loader) {\n'+fs.readFileSync(filePath)+'\n})';
        const script = new vm.Script(code, {
            filename: filePath,
            produceCachedData: false,
        });

        script.runInThisContext({
            filename: filePath,
        })(this._container, this);

        this.currentDir = oldCWD;
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = undefined) {
        if (! isString(resource)) {
            return false;
        }

        if (undefined === type && '.js' === path.extname(resource)) {
            return true;
        }

        return 'js' === type;
    }
}

module.exports = JsFileLoader;
