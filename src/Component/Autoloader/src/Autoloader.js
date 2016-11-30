global.__jymfony = global.__jymfony || {};

const Finder = require('./Finder');
const path   = require('path');
const fs     = require('fs');

let createProxy = function (baseDir) {
    return new Proxy({}, {
        get: function (target, name) {
            if (typeof name === 'symbol') {
                return undefined;
            }

            if (target[name] === undefined) {
                let fileName = baseDir + name;

                let stat = undefined;
                for (let i = 2;;) {
                    try {
                        stat = fs.statSync(fileName);
                        break;
                    } catch (e) {
                        if (--i) {
                            fileName += '.js';
                            continue;
                        }

                        break;
                    }
                }

                if (! stat) {
                    return undefined;
                }

                if (stat.isDirectory()) {
                    target[name] = createProxy(baseDir + name + '/');
                } else {
                    target[name] = require(fileName);
                }
            }

            return target[name];
        }
    })
};

module.exports = class Autoloader {
    constructor(finder = null, globalObject = global) {
        if (globalObject.__jymfony.autoload) {
            return;
        }

        if (! finder) {
            finder = new Finder();
        }

        this._registered = false;
        this._finder = finder;
        this._global = globalObject;
        this._global.__jymfony.autoload = this;
    }

    register() {
        if (this._registered) {
            return;
        }

        this._registered = true;

        let rootDir = this._finder.findRoot();
        for (let module of this._finder.listModules()) {
            let packageInfo;

            try {
                packageInfo = require(module + path.sep + 'package.json');
            } catch (e) {
                continue;
            }

            let dir = path.join(rootDir, 'node_modules', module);
            this._processPackageInfo(packageInfo, dir);
        }

        // let relativeRoot = path.relative(path.dirname(module.filename), rootDir);
        this._processPackageInfo(require(rootDir + '/package.json'), rootDir);
    }

    _processPackageInfo(packageInfo, baseDir) {
        if (! packageInfo.config || ! packageInfo.config['jymfony-autoload']) {
            return;
        }

        let config = packageInfo.config['jymfony-autoload'];
        if (config.namespaces) {
            this._processNamespaces(config.namespaces, baseDir);
        }

        if (config.includes) {
            this._processIncludes(config.includes, baseDir);
        }
    }

    _processNamespaces(config, baseDir) {
        for (let namespace in config) {
            if (! config.hasOwnProperty(namespace)) {
                continue;
            }

            let parts = namespace.split('.');
            let last = parts.pop();
            let parent = this._global;

            for (let part of parts) {
                parent = this._ensureNamespace(part, parent);
            }

            parent[last] = createProxy(baseDir + '/' + config[namespace]);
        }
    }

    _processIncludes(config, baseDir) {
        for (let fileName of config) {
            require(baseDir + '/' + fileName);
        }
    }

    _ensureNamespace(namespace, parent = this._global) {
        if (parent[namespace] === undefined) {
            return parent[namespace] = {};
        }

        return parent[namespace];
    }
};
