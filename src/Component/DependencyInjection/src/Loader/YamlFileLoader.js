import { extname } from 'path';
import { statSync } from 'fs';

const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const ServiceLocatorArgument = Jymfony.Component.DependencyInjection.Argument.ServiceLocatorArgument;
const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const JsonFileLoader = Jymfony.Component.DependencyInjection.Loader.JsonFileLoader;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * YamlFileLoader loads YAML files service definitions.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Loader
 */
export default class YamlFileLoader extends JsonFileLoader {
    /**
     * Constructor
     *
     * @param {Jymfony.Component.DependencyInjection.ContainerBuilder} container
     * @param {Jymfony.Component.Config.FileLocatorInterface} locator
     */
    __construct(container, locator) {
        super.__construct(container, locator);

        /**
         * @type {Jymfony.Component.Yaml.Parser}
         *
         * @private
         */
        this._yamlParser = undefined;

        /**
         * @type {number}
         *
         * @private
         */
        this._anonymousServicesCount = 0;

        /**
         * @type {string}
         *
         * @private
         */
        this._anonymousServicesSuffix = undefined;
    }

    load(resource) {
        const path = this._locator.locate(resource);
        this._anonymousServicesCount = 0;
        this._anonymousServicesSuffix = '~' + ContainerBuilder.hash(path);

        super.load(resource);
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = null) {
        if (! isString(resource)) {
            return false;
        }

        if (null === type && [ '.yaml', '.yml' ].includes(extname(resource))) {
            return true;
        }

        return [ 'yaml', 'yml' ].includes(type);
    }

    /**
     * Loads a YAML file.
     *
     * @param {string} file
     *
     * @returns {*} The file content
     *
     * @throws {InvalidArgumentException} when the given file is not a local file or when it does not exist
     */
    _loadFile(file) {
        if (! ReflectionClass.exists('Jymfony.Component.Yaml.Parser')) {
            throw new RuntimeException('Unable to load YAML config files as the Jymfony Yaml Component is not installed.');
        }

        try {
            statSync(file);
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not exist.', file), null, e);
        }

        if (! this._yamlParser) {
            this._yamlParser = new Jymfony.Component.Yaml.Parser();
        }

        let configuration;
        try {
            configuration = this._yamlParser.parseFile(file, Jymfony.Component.Yaml.Yaml.PARSE_CUSTOM_TAGS);
        } catch (e) {
            if (e instanceof Jymfony.Component.Yaml.Exception.ParseException) {
                throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not contain valid YAML: %s', file, e.message), null, e);
            }

            throw e;
        }

        return this._validate(configuration, file);
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
        if (value instanceof Jymfony.Component.Yaml.Tag.TaggedValue) {
            let argument = value.value;
            if ('iterator' === value.tag) {
                if (! isArray(argument)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('"!iterator" tag only accepts sequences in "%s".', file));
                }

                argument = this._resolveServices(argument, file, isParameter);
                try {
                    return new IteratorArgument(argument);
                } catch (e) {
                    throw new InvalidArgumentException(__jymfony.sprintf('"!iterator" tag only accepts arrays of "@service" references in "%s".', file));
                }
            }

            if ('service_locator' === value.tag) {
                if (! isObjectLiteral(argument)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('"!service_locator" tag only accepts maps in "%s".', file));
                }

                argument = this._resolveServices(argument, file, isParameter);

                try {
                    return new ServiceLocatorArgument(argument);
                } catch (e) {
                    throw new InvalidArgumentException(__jymfony.sprintf('"!service_locator" tag only accepts maps of "@service" references in "%s".', file));
                }
            }

            if ('tagged' === value.tag) {
                if (isString(argument) && argument) {
                    return new TaggedIteratorArgument(argument);
                }

                if (isObjectLiteral(argument) && undefined !== argument.tag) {
                    const diff = Object.keys(argument).filter(k => ! [ 'tag' ].includes(k));
                    if (0 < diff.length) {
                        throw new InvalidArgumentException(__jymfony.sprintf('"!%s" tag contains unsupported key "%s"; supported ones are "tag".', value.tag, diff.join('"", "')));
                    }

                    return new TaggedIteratorArgument(argument.tag);
                }

                throw new InvalidArgumentException(__jymfony.sprintf('"!%s" tags only accept a non empty string or an array with a key "tag" in "%s".', value.tag, file));
            }

            if ('service' === value.tag) {
                if (isParameter) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Using an anonymous service in a parameter is not allowed in "%s".', file));
                }

                const isLoadingInstanceof = this._isLoadingInstanceof;
                this._isLoadingInstanceof = false;
                const instanceOf = this._instanceof;
                this._instanceof = {};

                const id = __jymfony.sprintf('.%d_%s', ++this._anonymousServicesCount, (argument['class'] || '').replace(/^.*\\\\/g, '') + this._anonymousServicesSuffix);
                this._parseDefinition(id, argument, file, {});

                if (! this._container.hasDefinition(id)) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Creating an alias using the tag "!service" is not allowed in "%s".', file));
                }

                this._container.getDefinition(id).setPublic(false);

                this._isLoadingInstanceof = isLoadingInstanceof;
                this._instanceof = instanceOf;

                return new Reference(id);
            }

            throw new InvalidArgumentException(__jymfony.sprintf('Unsupported tag "!%s".', value.tag));
        }

        return super._resolveServices(value, file, isParameter);
    }
}
