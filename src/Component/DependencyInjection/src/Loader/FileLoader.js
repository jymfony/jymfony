import { accessSync, constants } from 'fs';
import { normalize } from 'path';

const BaseFileLoader = Jymfony.Component.Config.Loader.FileLoader;
const GlobResource = Jymfony.Component.Config.Resource.GlobResource;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;

/**
 * FileLoader is the abstract class used by all built-in loaders that are file based.
 *
 * @abstract
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
export default class FileLoader extends BaseFileLoader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.FileLocatorInterface} locator
     */
    __construct(container, locator) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerBuilder}
         *
         * @protected
         */
        this._container = container;

        /**
         * @type {boolean}
         *
         * @protected
         */
        this._isLoadingInstanceof = false;

        /**
         * @type {Object.<string, *>}
         *
         * @protected
         */
        this._instanceof = {};

        super.__construct(locator);
    }

    /**
     * Registers a set of classes as services using autoloader for discovery.
     *
     * @param {Jymfony.Component.DependencyInjection.Definition} prototype A definition to use as template
     * @param {string} namespace The namespace prefix of classes in the scanned directory
     * @param {string} resource The directory to look for classes, glob-patterns allowed
     * @param {string|string[]|null} exclude A globbed path of files to exclude or an array of globbed paths of files to exclude
     *
     * @protected
     */
    _registerClasses(prototype, namespace, resource, exclude = null) {
        if (! namespace.endsWith('.')) {
            throw new InvalidArgumentException(__jymfony.sprintf('Namespace prefix must end with a ".": %s.', namespace));
        }

        if (null === exclude || undefined === exclude) {
            exclude = [];
        }

        const classes = this._findClasses(namespace, resource, isArray(exclude) ? exclude : [ exclude ]);

        // Prepare for deep cloning
        const serializedPrototype = __jymfony.serialize(prototype);
        const interfaces = [];
        const singlyImplemented = {};

        for (const [ Class, errorMessage ] of __jymfony.getEntries(classes)) {
            const reflectionClass = new ReflectionClass(Class);
            if (reflectionClass.isInterface) {
                interfaces.push(Class);
            } else {
                const definition = __jymfony.unserialize(serializedPrototype);
                this._setDefinition(Class, definition);
                if (null !== errorMessage) {
                    definition.addError(errorMessage);

                    continue;
                }

                for (const IF of reflectionClass.interfaces) {
                    singlyImplemented[IF.name] = undefined !== singlyImplemented[IF] ? false : Class;
                }
            }
        }

        for (const IF of interfaces) {
            if (!! singlyImplemented[IF]) {
                this._container.setAlias(IF, singlyImplemented[IF]).setPublic(false);
            }
        }
    }

    /**
     * Registers a definition in the container with its instanceof-conditionals.
     *
     * @param {string} id
     * @param {Jymfony.Component.DependencyInjection.Definition} definition
     *
     * @protected
     */
    _setDefinition(id, definition) {
        if (this._isLoadingInstanceof) {
            if (! (definition instanceof ChildDefinition)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Invalid type definition "%s": ChildDefinition expected, "%s" given.', id, ReflectionClass.getClassName(definition)));
            }

            this._instanceof[id] = definition;
        } else {
            this._container.setDefinition(id, definition instanceof ChildDefinition ? definition : definition.setInstanceofConditionals(this._instanceof));
        }
    }

    /**
     * Finds classes into a namespace.
     *
     * @param {string} namespace
     * @param {string} pattern
     * @param {string[]} excludePatterns
     *
     * @returns {Object.<string, string | null>}
     *
     * @private
     */
    _findClasses(namespace, pattern, excludePatterns) {
        const parameterBag = this._container.parameterBag;

        const excludePaths = [];
        let excludePrefix = null;
        excludePatterns = parameterBag.unescapeValue(parameterBag.resolveValue(excludePatterns));
        for (const excludePattern of excludePatterns) {
            const resource = this._glob(excludePattern, true, false, true);
            for (const path of resource) {
                if (null === excludePrefix) {
                    excludePrefix = resource.prefix;
                }

                // Normalize Windows slashes
                excludePaths.push(normalize(path));
            }
        }

        pattern = parameterBag.unescapeValue(parameterBag.resolveValue(pattern));
        const classes = {};
        const extRegexp = /\.js$/;
        let prefixLen = null;
        const resource = this._glob(pattern, true, false, false, excludePaths);
        for (const path of resource) {
            if (null === prefixLen) {
                prefixLen = resource.prefix.length;

                if (excludePrefix && ! excludePrefix.startsWith(resource.prefix)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Invalid "exclude" pattern when importing classes for "%s": make sure your "exclude" pattern is a subset of the "resource" pattern (%s)', namespace, pattern));
                }
            }

            if (excludePaths.includes(normalize(path))) {
                continue;
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

            const Class = namespace + __jymfony.ltrim(path.substr(prefixLen, path.length - prefixLen - m[0].length).replace(/[/\\]/g, '.'), '.');
            let r = null;

            try {
                r = this._container.getReflectionClass(Class);
            } catch (e) {
                if (! (e instanceof ReflectionException)) {
                    throw e;
                }

                classes[Class] = __jymfony.sprintf('While discovering services from namespace "%s", an error was thrown when processing the class "%s": "%s".', namespace, Class, e.message);
                continue;
            }

            // Check to make sure the expected class exists
            if (! r) {
                throw new InvalidArgumentException(__jymfony.sprintf('Expected to find class "%s" in file "%s" while importing services from resource "%s", but it was not found! Check the namespace prefix used with the resource.', Class, path, pattern));
            }

            if (! r.isTrait) {
                classes[Class] = null;
            }
        }

        // Track only for new & removed files
        if (resource instanceof GlobResource) {
            this._container.addResource(resource);
        } else {
            for (const path of resource) {
                this._container.fileExists(path, false);
            }
        }

        return classes;
    }
}
