declare namespace Jymfony.Component.Validator.Mapping.Loader {
    import Parser = Jymfony.Component.Yaml.Parser;

    /**
     * Loads validation metadata from a YAML file.
     */
    export class YamlFileLoader extends JsonFileLoader {
        /**
         * The used YAML parser.
         */
        private _yamlParser: null | Parser;

        __construct(file: string): void;
        constructor(file: string);

        /**
         * Loads the YAML class descriptions from the given file.
         *
         * @throws {InvalidArgumentException} If the file could not be loaded or did not contain a YAML
         */
        protected _parseFile(): any;
    }
}
