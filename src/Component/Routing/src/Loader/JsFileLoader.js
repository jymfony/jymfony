const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

const fs = require('fs');
const path = require('path');
const vm = require('vm');

/**
 * JsFileLoader loads routes from a js file.
 *
 * The js file is required and the collection variable can be
 * used within the file to load routes.
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
class JsFileLoader extends FileLoader {
    /**
     * @inheritDoc
     */
    load(resource) {
        const filePath = this._locator.locate(resource);
        const previousCurrentDir = this.currentDir;

        this.currentDir = path.dirname(filePath);

        const code = '(function (loader) {\n'+fs.readFileSync(filePath)+'\n})';
        const script = new vm.Script(code, {
            filename: filePath,
            produceCachedData: false,
        });

        const collection = new RouteCollection();
        collection.addResource(new FileResource(filePath));

        script.runInThisContext({
            filename: filePath,
        })(collection, this);

        this.currentDir = previousCurrentDir;

        return collection;
    }

    /**
     * @inheritDoc
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
