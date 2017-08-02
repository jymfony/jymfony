const crypto = require('crypto');
const os = require('os');
const path = require('path');

const ConfigCache = Jymfony.Component.Config.ConfigCache;
const FileLocator = Jymfony.Component.Config.FileLocator;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const ParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag;
const JsFileLoader = Jymfony.Component.DependencyInjection.Loader.JsFileLoader;
const Kernel = Jymfony.Component.Kernel.Kernel;

class AppKernel extends Kernel {
    /**
     * @inheritDoc
     */
    registerBundles() {
        return [
            new Jymfony.Bundle.FrameworkBundle.FrameworkBundle(),
        ];
    }
}

module.exports = AppKernel;
