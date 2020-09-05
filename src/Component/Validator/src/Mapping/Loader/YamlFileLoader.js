const JsonFileLoader = Jymfony.Component.Validator.Mapping.Loader.JsonFileLoader;

/**
 * Loads validation metadata from a YAML file.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class YamlFileLoader extends JsonFileLoader {
    __construct(file) {
        super.__construct(file);

        /**
         * The used YAML parser.
         *
         * @type {null|Jymfony.Component.Yaml.Parser}
         *
         * @private
         */
        this._yamlParser = null;
    }

    /**
     * Loads the YAML class descriptions from the given file.
     *
     * @throws {InvalidArgumentException} If the file could not be loaded or did not contain a YAML
     *
     * @protected
     */
    _parseFile() {
        if (null === this._yamlParser) {
            this._yamlParser = new Jymfony.Component.Yaml.Parser();
        }

        let classes;
        try {
            classes = this._yamlParser.parseFile(this._file);
        } catch (e) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" does not contain valid YAML: ', this._file) + e.message, 0, e);
        }

        // Empty file
        if (null === classes) {
            return {};
        }

        // Not an array
        if (! isObjectLiteral(classes)) {
            throw new InvalidArgumentException(__jymfony.sprintf('The file "%s" must contain a YAML array.', this._file));
        }

        return classes;
    }
}
