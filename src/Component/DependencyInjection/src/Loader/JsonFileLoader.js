import { dirname, extname } from 'path';
import { readFileSync, statSync } from 'fs';

const Alias = Jymfony.Component.DependencyInjection.Alias;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const FileLoader = Jymfony.Component.DependencyInjection.Loader.FileLoader;
const Reference = Jymfony.Component.DependencyInjection.Reference;

const serviceKeywords = {
    'alias': 'alias',
    'parent': 'parent',
    'class': 'class',
    'shared': 'shared',
    'synthetic': 'synthetic',
    'lazy': 'lazy',
    'public': 'public',
    'abstract': 'abstract',
    'deprecated': 'deprecated',
    'factory': 'factory',
    'module': 'module',
    'arguments': 'arguments',
    'properties': 'properties',
    'configurator': 'configurator',
    'calls': 'calls',
    'tags': 'tags',
    'decorates': 'decorates',
    'decoration_inner_name': 'decoration_inner_name',
    'decoration_priority': 'decoration_priority',
    'shutdown_calls': 'shutdown_calls',
};

const prototypeKeywords = {
    'resource': 'resource',
    'namespace': 'namespace',
    'exclude': 'exclude',
    'parent': 'parent',
    'shared': 'shared',
    'lazy': 'lazy',
    'public': 'public',
    'abstract': 'abstract',
    'deprecated': 'deprecated',
    'factory': 'factory',
    'arguments': 'arguments',
    'properties': 'properties',
    'configurator': 'configurator',
    'calls': 'calls',
    'tags': 'tags',
    'shutdown_calls': 'shutdown_calls',
};

const instanceofKeywords = {
    'shared': 'shared',
    'lazy': 'lazy',
    'public': 'public',
    'properties': 'properties',
    'configurator': 'configurator',
    'calls': 'calls',
    'tags': 'tags',
    'shutdown_calls': 'shutdown_calls',
};

const defaultsKeywords = {
    'public': 'public',
    'tags': 'tags',
};

/**
 * JsonFileLoader loads JSON files service definitions.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
export default class JsonFileLoader extends FileLoader {
    /**
     * @inheritdoc
     */
    load(resource) {
        const path = this._locator.locate(resource);
        const content = this._loadFile(path);
        this._container.fileExists(path);

        // Empty file
        if (null === content) {
            return;
        }

        // Imports
        this._parseImports(content, path);

        // Parameters
        if (!! content.parameters) {
            if (! isObjectLiteral(content.parameters)) {
                throw new InvalidArgumentException(__jymfony.sprintf('The "parameters" key should contain a mapping in %s. Check your syntax.', path));
            }

            for (const [ key, value ] of __jymfony.getEntries(content['parameters'])) {
                this._container.setParameter(key, this._resolveServices(value, path, true));
            }
        }

        // Extensions
        this._loadFromExtensions(content);

        // Services
        this.currentDir = dirname(path);
        try {
            this._parseDefinitions(content, path);
        } finally {
            this._instanceof = {};
        }
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        if (! isString(resource)) {
            return false;
        }

        if (null === type && '.json' === extname(resource)) {
            return true;
        }

        return 'json' === type;
    }

    /**
     * Parse "import" section
     *
     * @param {Object.<string, *>} content
     * @param {string} file
     *
     * @protected
     */
    _parseImports(content, file) {
        if (! content.imports) {
            return;
        }

        if (! isArray(content.imports)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "imports" key should contain an array in %s. Check your syntax.', file));
        }

        const defaultDirectory = dirname(file);
        for (let Import of content.imports) {
            if (! isObjectLiteral(Import)) {
                Import = { resource: Import };
            }
            if (! Import.resource) {
                throw new InvalidArgumentException(__jymfony.sprintf('An import should provide a resource in %s. Check your syntax.', file));
            }

            this.currentDir = defaultDirectory;
            this.importResource(Import.resource, Import.type || null, !! Import.ignore_errors, file);
        }
    }

    /**
     * Parses the services definitions.
     *
     * @param {Object.<string, *>} content
     * @param {string} file
     *
     * @protected
     */
    _parseDefinitions(content, file) {
        if (! content.services) {
            return;
        }

        if (! isObjectLiteral(content.services)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The "services" key should contain a mapping in %s. Check your syntax.', file));
        }

        if (undefined !== content.services._instanceof) {
            const instanceOf = content.services._instanceof;
            delete content.services._instanceof;

            if (! isObjectLiteral(instanceOf)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Service "_instanceof" key must be a mapping, "%s" given in "%s".', null !== instanceOf ? typeof instanceOf : 'null', file));
            }

            this._instanceof = {};
            this._isLoadingInstanceof = true;
            for (const [ id, service ] of __jymfony.getEntries(instanceOf)) {
                if (! service || ! isObjectLiteral(service)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Type definition "%s" must be a non-empty array within "_instanceof" in %s. Check your syntax.', id, file));
                }

                if (isString(service) && service.startsWith('@')) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Type definition "%s" cannot be an alias within "_instanceof" in %s. Check your syntax.', id, file));
                }

                this._parseDefinition(id, service, file, {});
            }
        }

        this._isLoadingInstanceof = false;

        const defaults = this._parseDefaults(content, file);
        for (const [ id, service ] of __jymfony.getEntries(content.services)) {
            this._parseDefinition(id, service, file, __jymfony.deepClone(defaults));
        }
    }

    /**
     * Parse the "_defaults" service section.
     *
     * @param {Object.<string, *>} content
     * @param {string} file
     *
     * @returns {Object.<string, *>}
     *
     * @throws {InvalidArgumentException}
     *
     * @protected
     */
    _parseDefaults(content, file) {
        if (undefined === content.services._defaults) {
            return [];
        }

        const defaults = content.services._defaults;
        delete content.services._defaults;

        if (! isObjectLiteral(defaults)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Service "_defaults" key must be a mapping, "%s" given in "%s".', null !== defaults ? typeof defaults : 'null', file));
        }

        for (const key of Object.keys(defaults)) {
            if (undefined === defaultsKeywords[key]) {
                throw new InvalidArgumentException(__jymfony.sprintf('The configuration key "%s" cannot be used to define a default value in "%s". Allowed keys are "%s".', key, file, Object.keys(defaultsKeywords).join('", "')));
            }
        }

        if (defaults.tags) {
            const tags = defaults.tags;
            if (! isArray(tags)) {
                throw new InvalidArgumentException(__jymfony.sprintf('Parameter "tags" in "_defaults" must be an array in %s. Check your syntax.', file));
            }

            for (let tag of tags) {
                if (! isObjectLiteral(tag)) {
                    tag = { name: tag };
                } else {
                    tag = { ...tag };
                }

                if (! tag.name) {
                    throw new InvalidArgumentException(__jymfony.sprintf('A "tags" entry in "_defaults" is missing a "name" key in %s.', file));
                }

                const name = tag.name;
                delete tag.name;

                if (! isString(name) || '' === name) {
                    throw new InvalidArgumentException(__jymfony.sprintf('The tag name in "_defaults" must be a non-empty string in %s.', file));
                }

                for (const [ attribute, value ] of __jymfony.getEntries(tag)) {
                    if (! isScalar(value) && null !== value) {
                        throw new InvalidArgumentException(__jymfony.sprintf('Tag "%s", attribute "%s" in "_defaults" must be of a scalar-type in %s. Check your syntax.', name, attribute, file));
                    }
                }
            }
        }

        return defaults;
    }

    /**
     * Is this definition using short syntax.
     *
     * @param {Object.<*, *>} service
     *
     * @returns {boolean}
     *
     * @protected
     */
    _isUsingShortSyntax(service) {
        for (const [ key ] of __jymfony.getEntries(service)) {
            if (isString(key) && ('' === key || '$' !== key[0])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Parses a definition.
     *
     * @param {string} id
     * @param {Object.<string, *>|string} service
     * @param {string} file
     * @param {Object.<string, *>} defaults
     *
     * @throws {InvalidArgumentException} When tags are invalid
     *
     * @protected
     */
    _parseDefinition(id, service, file, defaults) {
        if (id.match(/^_[a-zA-Z0-9_]*$/)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Service names that start with an underscore are reserved. Rename the "%s" service or define it in JS instead.', id));
        }

        if (isString(service) && service.startsWith('@')) {
            const alias = new Alias(service.substr(1));
            this._container.setAlias(id, alias);
            if (defaults.public) {
                alias.setPublic(defaults.public);
            }

            return;
        }

        if (isArray(service) && this._isUsingShortSyntax(service)) {
            service = { arguments: service };
        }

        if (null === service) {
            service = {};
        }

        if (! isObjectLiteral(service)) {
            throw new InvalidArgumentException(__jymfony.sprintf('A service definition must be a mapping or a string starting with "@" but %s found for service "%s" in %s. Check your syntax.', typeof service, id, file));
        }

        this._checkDefinition(id, service, file);

        if (service.alias) {
            const alias = new Alias(service.alias);
            this._container.setAlias(id, alias);
            if ('public' in service) {
                alias.setPublic(service.public);
            } else if ('public' in defaults) {
                alias.setPublic(defaults.public);
            }

            for (const [ key, value ] of __jymfony.getEntries(service)) {
                if (! [ 'alias', 'public', 'deprecated' ].includes(key)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('The configuration key "%s" is unsupported for the service "%s" which is defined as an alias in "%s". Allowed configuration keys for service aliases are "alias", "public" and "deprecated".', key, id, file));
                }

                if ('deprecated' === key) {
                    alias.setDeprecated(true, value);
                }
            }

            return;
        }

        let definition;
        if (this._isLoadingInstanceof) {
            definition = new ChildDefinition('');
        } else if (undefined !== service.parent) {
            if (0 !== Object.keys(this._instanceof).length) {
                throw new InvalidArgumentException(__jymfony.sprintf('The service "%s" cannot use the "parent" option in the same file where "_instanceof" configuration is defined as using both is not supported. Move your child definitions to a separate file.', id));
            }

            for (const k of Object.keys(defaults)) {
                if ('tags' === k) {
                    // Since tags are never inherited from parents, there is no confusion
                    // Thus we can safely add them as defaults to ChildDefinition
                    continue;
                }

                if (undefined === service[k]) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Attribute "%s" on service "%s" cannot be inherited from "_defaults" when a "parent" is set. Move your child definitions to a separate file or define this attribute explicitly.', k, id));
                }
            }

            if ('' !== service.parent && '@' === service.parent[0]) {
                throw new InvalidArgumentException(__jymfony.sprintf('The value of the "parent" option for the "%s" service must be the id of the service without the "@" prefix (replace "%s" with "%s").', id, service.parent, service.parent.substr(1)));
            }

            definition = new ChildDefinition(service.parent);
        } else {
            definition = new Definition();

            if (defaults.public) {
                definition.setPublic(defaults.public);
            }

            definition.setChanges({});
        }

        if (undefined !== service['class']) {
            definition.setClass(service['class']);
        }

        if (undefined !== service.shared) {
            definition.setShared(service.shared);
        }

        if (undefined !== service.synthetic) {
            definition.setSynthetic(service.synthetic);
        }

        if (undefined !== service.lazy) {
            definition.setLazy(!! service.lazy);

            if (isString(service.lazy)) {
                definition.addTag('proxy', { 'interface': service.lazy });
            }
        }

        if (undefined !== service['public']) {
            definition.setPublic(service['public']);
        }

        if (undefined !== service['abstract']) {
            definition.setAbstract(service['abstract']);
        }

        if (undefined !== service.deprecated) {
            definition.setDeprecated(true, service.deprecated);
        }

        if (undefined !== service.factory) {
            definition.setFactory(this._parseCallable(service.factory, 'factory', id, file));
        }

        if (undefined !== service.module) {
            const [ module, property ] = isArray(service.module) ? service.module : [ service.module, undefined ];

            definition.setModule(module, property);
        }

        if (undefined !== service.arguments) {
            definition.setArguments(this._resolveServices(service.arguments, file));
        }

        if (undefined !== service.properties) {
            definition.setProperties(this._resolveServices(service.properties, file));
        }

        if (undefined !== service.configurator) {
            definition.setConfigurator(this._parseCallable(service.configurator, 'configurator', id, file));
        }

        for (const key of [ 'calls', 'shutdown_calls' ]) {
            if (undefined === service[key]) {
                continue;
            }

            if (! isArray(service[key])) {
                throw new InvalidArgumentException(__jymfony.sprintf('Parameter "%s" must be an array for service "%s" in %s. Check your syntax.', key, id, file));
            }

            for (const call of service[key]) {
                let method, args;

                if (undefined !== call.method) {
                    method = call.method;
                    args = call.arguments ? this._resolveServices(call.arguments, file) : [];
                } else {
                    method = call[0];
                    args = !!call[1] ? this._resolveServices(call[1], file) : [];
                }

                if (! isArray(args)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('The second parameter for function call "%s" must be an array of its arguments for service "%s" in %s. Check your syntax.', method, id, file));
                }

                if ('calls' === key) {
                    definition.addMethodCall(method, args);
                } else {
                    definition.addShutdownCall(method, args);
                }
            }
        }

        let tags = service.tags || [];
        if (isObjectLiteral(tags)) {
            tags = Object.values(tags);
        } else if (! isArray(tags)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Parameter "tags" must be an array for service "%s" in %s. Check your syntax.', id, file));
        }


        if (undefined !== defaults.tags) {
            tags.push(...defaults.tags);
        }

        for (let tag of tags) {
            if (! isObjectLiteral(tag)) {
                tag = { name: tag };
            } else {
                tag = { ...tag };
            }

            if (undefined === tag.name) {
                throw new InvalidArgumentException(__jymfony.sprintf('A "tags" entry is missing a "name" key for service "%s" in %s.', id, file));
            }

            const name = tag.name;
            delete tag.name;

            if (! isString(name) || '' === name) {
                throw new InvalidArgumentException(__jymfony.sprintf('The tag name for service "%s" in %s must be a non-empty string.', id, file));
            }

            for (const [ attribute, value ] of __jymfony.getEntries(tag)) {
                if (! isScalar(value) && null !== value) {
                    throw new InvalidArgumentException(__jymfony.sprintf('A "tags" attribute must be of a scalar-type for service "%s", tag "%s", attribute "%s" in %s. Check your syntax.', id, name, attribute, file));
                }
            }

            definition.addTag(name, tag);
        }

        if (undefined !== service.decorates) {
            if ('' !== service.decorates && '@' === service.decorates[0]) {
                throw new InvalidArgumentException(__jymfony.sprintf('The value of the "decorates" option for the "%s" service must be the id of the service without the "@" prefix (replace "%s" with "%s").', id, service.decorates, service.decorates.substr(1)));
            }

            const renameId = service.decoration_inner_name || null;
            const priority = service.decoration_priority || 0;
            definition.setDecoratedService(service.decorates, renameId, priority);
        }

        if (undefined !== service.namespace && undefined === service.resource) {
            throw new InvalidArgumentException(__jymfony.sprintf('A "resource" attribute must be set when the "namespace" attribute is set for service "%s" in %s. Check your syntax.', id, file));
        }

        if (undefined !== service.resource) {
            if (! isString(service.resource)) {
                throw new InvalidArgumentException(__jymfony.sprintf('A "resource" attribute must be of type string for service "%s" in %s. Check your syntax.', id, file));
            }

            const exclude = service.exclude || null;
            const namespace = service.namespace || id;
            this._registerClasses(definition, namespace, service.resource, exclude);
        } else {
            this._setDefinition(id, definition);
        }
    }

    /**
     * Parses a callable.
     *
     * @param {string|string[]} callable A callable
     * @param {string} parameter A parameter (e.g. 'factory' or 'configurator')
     * @param {string} id A service identifier
     * @param {string} file A parsed file
     *
     * @throws {InvalidArgumentException} When errors occur
     *
     * @returns {string|array|Jymfony.Component.DependencyInjection.Reference} A parsed callable
     *
     * @protected
     */
    _parseCallable(callable, parameter, id, file) {
        if (isString(callable)) {
            if ('' !== callable && '@' === callable[0]) {
                if (-1 === callable.indexOf(':')) {
                    return [ this._resolveServices(callable, file), '__invoke' ];
                }

                throw new InvalidArgumentException(__jymfony.sprintf('The value of the "%s" option for the "%s" service must be the id of the service without the "@" prefix (replace "%s" with "%s").', parameter, id, callable, callable.substr(1)));
            }

            if (-1 !== callable.indexOf(':')) {
                const parts = callable.split(':');

                return [ this._resolveServices('@' + parts[0], file), parts[1] ];
            }

            return callable;
        }

        if (isArray(callable)) {
            if (undefined !== callable[0] && undefined !== callable[1]) {
                return [ this._resolveServices(callable[0], file), callable[1] ];
            }

            if ('factory' === parameter && !! callable[1] && null === callable[0]) {
                return callable;
            }

            throw new InvalidArgumentException(__jymfony.sprintf('Parameter "%s" must contain an array with two elements for service "%s" in %s. Check your syntax.', parameter, id, file));
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Parameter "%s" must be a string or an array for service "%s" in %s. Check your syntax.', parameter, id, file));
    }

    /**
     * Loads a file.
     *
     * @param {string} file
     *
     * @returns {*} The file content
     *
     * @throws {InvalidArgumentException} when the given file is not a local file or when it does not exist
     *
     * @protected
     */
    _loadFile(file) {
        try {
            statSync(file);
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not exist.', file), null, e);
        }

        const configuration = JSON.parse(readFileSync(file).toString('utf-8'));

        return this._validate(configuration, file);
    }

    /**
     * Validates a file.
     *
     * @param {*} content
     * @param {string} file
     *
     * @returns {*}
     *
     * @throws {InvalidArgumentException} When service file is not valid
     *
     * @protected
     */
    _validate(content, file) {
        if (null === content || undefined === content) {
            return content;
        }

        if (! isObjectLiteral(content)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The service file "%s" is not valid. It should contain a mapping. Check your syntax.', file));
        }

        for (const namespace of Object.keys(content)) {
            if ([ 'imports', 'parameters', 'services' ].includes(namespace)) {
                continue;
            }

            if (! this._container.hasExtension(namespace)) {
                const extensionNamespaces = Object.values(this._container.getExtensions())
                    .map(ext => ext.alias).filter(v => !! v);

                throw new InvalidArgumentException(__jymfony.sprintf('There is no extension able to load the configuration for "%s" (in %s). Looked for namespace "%s", found %s', namespace, file, namespace, extensionNamespaces ? __jymfony.sprintf('"%s"', extensionNamespaces.join('", "')) : 'none'));
            }
        }

        return content;
    }

    /**
     * Resolves services.
     *
     * @param {*} value
     * @param {string} file
     * @param {boolean} isParameter
     *
     * @returns {array|string|Jymfony.Component.DependencyInjection.Reference|Jymfony.Component.DependencyInjection.Argument.ArgumentInterface}
     *
     * @protected
     */
    _resolveServices(value, file, isParameter = false) {
        if (isArray(value) || isObjectLiteral(value)) {
            for (const [ k, v ] of __jymfony.getEntries(value)) {
                value[k] = this._resolveServices(v, file, isParameter);
            }
        } else if (isString(value) && value.startsWith('@=')) {
            throw new LogicException(__jymfony.sprintf('The "@=" expression syntax cannot be used without the ExpressionLanguage component.'));
        } else if (isString(value) && value.startsWith('@')) {
            let invalidBehavior = null;
            if (value.startsWith('@@')) {
                value = value.substr(1);
            } else if (value.startsWith('@!')) {
                value = value.substr(2);
                invalidBehavior = Container.IGNORE_ON_UNINITIALIZED_REFERENCE;
            } else if (value.startsWith('@?')) {
                value = value.substr(2);
                invalidBehavior = Container.IGNORE_ON_INVALID_REFERENCE;
            } else {
                value = value.substr(1);
                invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE;
            }

            if (null !== invalidBehavior) {
                value = new Reference(value, invalidBehavior);
            }
        }

        return value;
    }

    /**
     * Loads from Extensions.
     *
     * @param {*} content
     *
     * @protected
     */
    _loadFromExtensions(content) {
        let namespace, values;
        for ([ namespace, values ] of __jymfony.getEntries(content)) {
            if ([ 'imports', 'parameters', 'services' ].includes(namespace)) {
                continue;
            }

            if (! isObjectLiteral(values) && null !== values) {
                values = {};
            }

            this._container.loadFromExtension(namespace, values);
        }
    }

    /**
     * Checks the keywords used to define a service.
     *
     * @param {string} id The service name
     * @param {*} definition The service definition to check
     * @param {string} file The loaded file
     *
     * @protected
     */
    _checkDefinition(id, definition, file) {
        let keywords;

        if (this._isLoadingInstanceof) {
            keywords = instanceofKeywords;
        } else if (undefined !== definition.resource || undefined !== definition.namespace) {
            keywords = prototypeKeywords;
        } else {
            keywords = serviceKeywords;
        }

        for (const key of Object.keys(definition)) {
            if (! keywords[key]) {
                throw new InvalidArgumentException(__jymfony.sprintf('The configuration key "%s" is unsupported for definition "%s" in "%s". Allowed configuration keys are "%s".', key, id, file, Object.keys(keywords).join('", "')));
            }
        }
    }
}
