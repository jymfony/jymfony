const FileLocator = Jymfony.Component.Config.FileLocator;
const JsFileLoader = Jymfony.Component.Config.Loader.JsFileLoader;
const Extension = Jymfony.Component.DependencyInjection.Extension.Extension;
const path = require('path');

/**
 * @memberOf Jymfony.FrameworkBundle.DependencyInjection
 */
class FrameworkExtension extends Extension {
    /**
     * Load a configuration
     *
     * @param {*} configs
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     */
    load(configs, container) {
        let loader = new JsFileLoader(container, new FileLocator(path.join(__dirname, '..', 'Resources', 'config')));
        loader.load('services.js');
    }
}

module.exports = FrameworkExtension;
