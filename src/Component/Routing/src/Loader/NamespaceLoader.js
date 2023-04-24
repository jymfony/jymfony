import { accessSync, constants } from 'fs';

const FileLocator = Jymfony.Component.Config.FileLocator;
const FileLocatorFileNotFoundException = Jymfony.Component.Config.Exception.FileLocatorFileNotFoundException;
const Loader = Jymfony.Component.Config.Loader.Loader;
const FileExistenceResource = Jymfony.Component.Config.Resource.FileExistenceResource;
const GlobResource = Jymfony.Component.Config.Resource.GlobResource;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

/**
 * AnnotationDirectoryLoader loads routing information from annotations set
 * on classes and methods.
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class NamespaceLoader extends Loader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Routing.Loader.AnnotationClassLoader} loader
     * @param {string | null} [env = null]
     */
    __construct(loader, env = null) {
        super.__construct(env);

        this._locator = undefined;
        this._loader = loader;
    }
    /**
     * Loads from annotations from a namespace.
     *
     * @param {string|any} namespace A valid namespace
     * @param {string|null} type The resource type
     *
     * @returns {Jymfony.Component.Routing.RouteCollection} A RouteCollection instance
     *
     * @throws {InvalidArgumentException} When the directory does not exist or its routes cannot be parsed
     */
    load(namespace, type = null) {
        if (isString(namespace)) {
            const parts = namespace.split('.');
            namespace = ReflectionClass._recursiveGet(global, parts);
        }

        if (undefined !== namespace.__namespace) {
            namespace = namespace.__namespace;
        }

        const collection = new RouteCollection();
        this._locator = new FileLocator(namespace.directories);

        for (const Class of this._findClasses(namespace.name, collection)) {
            try {
                collection.addCollection(this._loader.load(Class, type));
            } catch (e) {
                // Do nothing.
            }
        }

        return collection;
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        if ('namespace' === type) {
            return true;
        }

        if (isString(resource) && resource.startsWith('.')) {
            return false;
        }

        if (type || (isString(resource) && ! resource.match(/^(?:\.?[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)+$/))) {
            return false;
        }

        if (isString(resource)) {
            const parts = resource.split('.');
            resource = ReflectionClass._recursiveGet(global, parts);
        }

        if (! resource) {
            return false;
        }

        return !! resource.__namespace;
    }

    /**
     * @private
     */
    _glob() {
        let prefix = '.';

        try {
            prefix = this._locator.locate(prefix, this._currentDir, true);
        } catch (e) {
            if (! (e instanceof FileLocatorFileNotFoundException)) {
                throw e;
            }
        }

        return new GlobResource(prefix, '/*', true, false, []);
    }

    /**
     * Finds classes into a namespace.
     *
     * @param {string} namespace
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     *
     * @returns {string[]}
     *
     * @private
     */
    _findClasses(namespace, collection) {
        const classes = {};
        const extRegexp = /\.js$/;
        let prefixLen = null;
        const resource = this._glob();
        for (const path of resource) {
            if (null === prefixLen) {
                prefixLen = resource.prefix.length;
            }

            const m = path.match(extRegexp);
            if (null === m) {
                continue;
            }

            try {
                accessSync(path, constants.R_OK);
            } catch (e) {
                continue;
            }

            const Class = namespace + '.' + __jymfony.ltrim(path.substr(prefixLen, path.length - prefixLen - m[0].length).replace(/[/\\]/g, '.'), '.');
            let r = null;

            try {
                r = new ReflectionClass(Class);
            } catch (e) {
                continue;
            }

            // Check to make sure the expected class exists
            if (! r || r.isInterface || r.isTrait) {
                continue;
            }

            classes[Class] = true;
        }

        // Track only for new & removed files
        if (resource instanceof GlobResource) {
            collection.addResource(resource);
        } else {
            for (const path of resource) {
                collection.addResource(new FileExistenceResource(path));
            }
        }

        return Object.keys(classes);
    }
}
