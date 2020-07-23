const { dirname, resolve } = require('path');

const Storage = function () {};
Storage.prototype = {};

/**
 * @memberOf Jymfony.Component.Autoloader
 */
class DescriptorStorage {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Autoloader.ClassLoader} classLoader
     * @param {string} filename
     * @param {Storage} storage
     */
    constructor(classLoader, filename = undefined, storage = new Storage()) {
        /**
         * @type {Jymfony.Component.Autoloader.ClassLoader}
         *
         * @private
         */
        this._classLoader = classLoader;

        /**
         * @type {string}
         *
         * @private
         */
        this._filename = filename;

        /**
         * @type {Storage}
         *
         * @private
         */
        this._storage = storage;
    }

    /**
     * Sets a new file to be processed.
     *
     * @param {string} filename
     *
     * @returns {Jymfony.Component.Autoloader.DescriptorStorage}
     */
    setFile(filename) {
        return new DescriptorStorage(this._classLoader, resolve(filename), this._storage);
    }

    /**
     * Registers a decorator descriptor.
     *
     * @param {DecoratorDescriptor} descriptor
     * @param {Identifier} alias
     */
    register(descriptor, alias = descriptor.name) {
        const name = alias.name;
        this._storage[this._filename + name] = descriptor;
    }

    /**
     * Register decorators as exported by export * from ..
     *
     * @param {string} source
     */
    registerAllFrom(source) {
        try {
            source = require.resolve(source, { paths: [ dirname(this._filename) ] });
        } catch (e) {
            return;
        }

        this._classLoader.getCode(source);

        for (const [ name, descriptor ] of __jymfony.getEntries(this._storage)) {
            if (name.startsWith(source + '@')) {
                this._storage[name.replace(new RegExp('^' + __jymfony.regex_quote(source)), this._filename)] = descriptor;
            }
        }
    }

    /**
     * Imports a decorator descriptor.
     *
     * @param {string} source
     * @param {string} descriptorName
     *
     * @returns {DecoratorDescriptor}
     */
    import(source, descriptorName) {
        source = require.resolve(source, { paths: [ dirname(this._filename) ] });
        this._classLoader.getCode(source);

        return this._storage[source + descriptorName];
    }
}

module.exports = DescriptorStorage;
