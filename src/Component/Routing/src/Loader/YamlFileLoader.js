import { extname } from 'path';
import { statSync } from 'fs';

const JsonFileLoader = Jymfony.Component.Routing.Loader.JsonFileLoader;

/**
 * JsonFileLoader loads JSON routing files.
 *
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class YamlFileLoader extends JsonFileLoader {
    __construct(locator, env = null) {
        super.__construct(locator, env);

        /**
         * @type {Jymfony.Component.Yaml.Parser}
         *
         * @private
         */
        this._yamlParser = undefined;
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
     * @inheritdoc
     */
    load(file) {
        const path = this._locator.locate(file);
        if (! ReflectionClass.exists('Jymfony.Component.Yaml.Parser')) {
            throw new RuntimeException('Unable to load YAML config files as the Jymfony Yaml Component is not installed.');
        }

        try {
            statSync(path);
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not exist.', path), null, e);
        }

        if (! this._yamlParser) {
            this._yamlParser = new Jymfony.Component.Yaml.Parser();
        }

        let parsedConfig;
        try {
            parsedConfig = this._yamlParser.parseFile(path, Jymfony.Component.Yaml.Yaml.PARSE_CUSTOM_TAGS);
        } catch (e) {
            if (e instanceof Jymfony.Component.Yaml.Exception.ParseException) {
                throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not contain valid YAML: %s', file, e.message), null, e);
            }

            throw e;
        }

        return this._doLoad(parsedConfig, path, file);
    }
}
