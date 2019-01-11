const FileLoader = Jymfony.Component.Config.Loader.FileLoader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;
const RoutingConfigurator = Jymfony.Component.Routing.Loader.Configurator.RoutingConfigurator;

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
     * @inheritdoc
     */
    load(resource) {
        const filePath = this._locator.locate(resource);
        const previousCurrentDir = this.currentDir;

        this.currentDir = path.dirname(filePath);

        const code = '(function (loader, __filename, __dirname) {\n'+fs.readFileSync(filePath)+'\n})';
        const script = new vm.Script(code, {
            filename: filePath,
            produceCachedData: false,
        });

        let collection;
        const result = script.runInThisContext({
            filename: filePath,
        })(this, filePath, this.currentDir);

        if (isFunction(result)) {
            const configurator = new RoutingConfigurator(new RouteCollection(), this, this.currentDir, filePath);
            result(configurator, this);

            collection = configurator.build();
        } else {
            collection = result;
        }

        collection.addResource(new FileResource(filePath));
        this.currentDir = previousCurrentDir;

        return collection;
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
