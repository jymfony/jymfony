declare namespace Jymfony.Component.Validator {
    import LoaderInterface = Jymfony.Component.Metadata.Loader.LoaderInterface;
    import MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;
    import TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

    export class ValidatorBuilder {
        private _loaders: LoaderInterface[];
        private _annotationMappings: boolean;
        private _jsonMappings: string[];
        private _yamlMappings: string[];
        private _methodMappings: Function[];
        private _metadataFactory: MetadataFactoryInterface | null;
        private _validatorFactory: ConstraintValidatorFactoryInterface | null;
        private _translator: TranslatorInterface | null;
        private _translationDomain: string | null;

        __construct(): void;
        constructor();

        /**
         * Adds a JSON constraint mapping file to the validator.
         *
         * @param path The path to the mapping file
         */
        addJsonMapping(path: string): this;

        /**
         * Adds a list of JSON constraint mappings file to the validator.
         *
         * @param paths The paths to the mapping files
         */
        addJsonMappings(paths: string[]): this;

        /**
         * Adds a YAML constraint mapping file to the validator.
         *
         * @param path The path to the mapping file
         */
        addYamlMapping(path: string): this;

        /**
         * Adds a list of YAML constraint mappings file to the validator.
         *
         * @param paths The paths to the mapping files
         */
        addYamlMappings(paths: string[]): this;

        /**
         * Enables constraint mapping using the given static method.
         */
        addMethodMapping(method: Function): this;

        /**
         * Enables constraint mapping using the given static methods.
         */
        addMethodMappings(methods: Function[]): this;

        /**
         * Enables annotation based constraint mapping.
         */
        enableAnnotationMapping(): this;

        /**
         * Disables annotation based constraint mapping.
         */
        disableAnnotationMapping(): this;

        /**
         * Sets the class metadata factory used by the validator.
         */
        setMetadataFactory(metadataFactory: MetadataFactoryInterface): this;

        /**
         * Sets the constraint validator factory used by the validator.
         */
        setConstraintValidatorFactory(validatorFactory: ConstraintValidatorFactoryInterface): this;

        /**
         * Sets the translator used for translating violation messages.
         */
        setTranslator(translator: TranslatorInterface): this;

        /**
         * Sets the default translation domain of violation messages.
         *
         * The same message can have different translations in different domains.
         * Pass the domain that is used for violation messages by default to this
         * method.
         *
         * @param {string} translationDomain
         *
         * @returns {Jymfony.Component.Validator.ValidatorBuilder}
         */
        setTranslationDomain(translationDomain: string): this;

        addLoader(loader: LoaderInterface): this;
        getLoaders(): LoaderInterface[];

        /**
         * Builds and returns a new validator object.
         */
        getValidator(): ValidatorInterface;
    }
}
