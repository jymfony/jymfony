import { dirname, extname } from 'path';
import { Script } from 'vm';
import { readFileSync } from 'fs';

const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;

/**
 * JsFileLoader loads service definitions from a js file.
 *
 * The js file is required and the container variable can be
 * used within the file to change the container.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
export default class JsFileLoader extends FileLoader {
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
        this.currentDir = dirname(filePath);
        this._container.addResource(new FileResource(filePath));

        const code = '(function (container, loader) {\n' + readFileSync(filePath) + '\n})';
        const script = new Script(code, {
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

        if (undefined === type && '.js' === extname(resource)) {
            return true;
        }

        return 'js' === type;
    }
}
