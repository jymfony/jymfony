const ConstraintValidatorFactory = Jymfony.Component.Validator.ConstraintValidatorFactory;
const ExecutionContextFactory = Jymfony.Component.Validator.Context.ExecutionContextFactory;
const LazyLoadingMetadataFactory = Jymfony.Component.Validator.Mapping.Factory.LazyLoadingMetadataFactory;
const Loader = Jymfony.Component.Validator.Mapping.Loader;
const LocaleAwareInterface = Jymfony.Contracts.Translation.LocaleAwareInterface;
const RecursiveValidator = Jymfony.Component.Validator.Validator.RecursiveValidator;
const TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
const TranslatorTrait = Jymfony.Contracts.Translation.TranslatorTrait;
const ValidatorException = Jymfony.Component.Validator.Exception.ValidatorException;

/**
 * @memberOf Jymfony.Component.Validator
 */
export default class ValidatorBuilder {
    __construct() {
        this._loaders = [];

        /**
         * @type {boolean}
         *
         * @private
         */
        this._annotationMappings = false;

        /**
         * @type {string[]}
         *
         * @private
         */
        this._jsonMappings = [];

        /**
         * @type {string[]}
         *
         * @private
         */
        this._yamlMappings = [];

        /**
         * @type {Function[]}
         *
         * @private
         */
        this._methodMappings = [];

        /**
         * @type {Jymfony.Contracts.Metadata.MetadataFactoryInterface|null}
         *
         * @private
         */
        this._metadataFactory = null;

        /**
         * @type {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface|null}
         *
         * @private
         */
        this._validatorFactory = null;

        /**
         * @type {Jymfony.Contracts.Translation.TranslatorInterface|null}
         *
         * @private
         */
        this._translator = null;

        /**
         * @type {string|null}
         *
         * @private
         */
        this._translationDomain = null;
    }

    /**
     * Adds a JSON constraint mapping file to the validator.
     *
     * @param {string} path The path to the mapping file
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addJsonMapping(path) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._jsonMappings.push(path);

        return this;
    }

    /**
     * Adds a list of JSON constraint mappings file to the validator.
     *
     * @param {string[]} paths The paths to the mapping files
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addJsonMappings(paths) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._jsonMappings.push(...paths);

        return this;
    }

    /**
     * Adds a YAML constraint mapping file to the validator.
     *
     * @param {string} path The path to the mapping file
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addYamlMapping(path) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._yamlMappings.push(path);

        return this;
    }

    /**
     * Adds a list of YAML constraint mappings file to the validator.
     *
     * @param {string[]} paths The paths to the mapping files
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addYamlMappings(paths) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._yamlMappings.push(...paths);

        return this;
    }

    /**
     * Enables constraint mapping using the given static method.
     *
     * @param {Function} method
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addMethodMapping(method) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._methodMappings.push(method);

        return this;
    }

    /**
     * Enables constraint mapping using the given static methods.
     *
     * @param {Function[]} methods The methods
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addMethodMappings(methods) {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot add custom mappings after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._methodMappings.push(...methods);

        return this;
    }

    /**
     * Enables annotation based constraint mapping.
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    enableAnnotationMapping() {
        if (null !== this._metadataFactory) {
            throw new ValidatorException('You cannot enable annotation mapping after setting a custom metadata factory. Configure your metadata factory instead.');
        }

        this._annotationMappings = true;

        return this;
    }

    /**
     * Disables annotation based constraint mapping.
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    disableAnnotationMapping() {
        this._annotationMappings = false;

        return this;
    }

    /**
     * Sets the class metadata factory used by the validator.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataFactoryInterface} metadataFactory
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    setMetadataFactory(metadataFactory) {
        if (0 < this._yamlMappings.length || 0 < this._methodMappings.length) {
            throw new ValidatorException('You cannot set a custom metadata factory after adding custom mappings. You should do either of both.');
        }

        this._metadataFactory = metadataFactory;

        return this;
    }

    /**
     * Sets the constraint validator factory used by the validator.
     *
     * @param {Jymfony.Component.Validator.ConstraintValidatorFactoryInterface} validatorFactory
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    setConstraintValidatorFactory(validatorFactory) {
        this._validatorFactory = validatorFactory;

        return this;
    }

    /**
     * Sets the translator used for translating violation messages.
     *
     * @param {Jymfony.Contracts.Translation.TranslatorInterface} translator
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    setTranslator(translator) {
        this._translator = translator;

        return this;
    }

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
    setTranslationDomain(translationDomain) {
        this._translationDomain = translationDomain;

        return this;
    }

    /**
     * @param {Jymfony.Component.Metadata.Loader.LoaderInterface} loader
     *
     * @returns {Jymfony.Component.Validator.ValidatorBuilder}
     */
    addLoader(loader) {
        this._loaders.push(loader);

        return this;
    }

    /**
     * @returns {Jymfony.Component.Metadata.Loader.LoaderInterface[]}
     */
    getLoaders() {
        const loaders = [];
        for (const mapping of this._jsonMappings) {
            loaders.push(new Loader.JsonFileLoader(mapping));
        }

        for (const mapping of this._yamlMappings) {
            loaders.push(new Loader.YamlFileLoader(mapping));
        }

        for (const mapping of this._methodMappings) {
            loaders.push(new Loader.StaticMethodLoader(mapping));
        }

        if (this._annotationMappings) {
            loaders.push(new Loader.AnnotationLoader());
        }

        return [ ...loaders, ...this._loaders ];
    }

    /**
     * Builds and returns a new validator object.
     *
     * @returns {Jymfony.Component.Validator.Validator.ValidatorInterface}
     */
    getValidator() {
        let metadataFactory = this._metadataFactory;

        if (! metadataFactory) {
            const loaders = this.getLoaders();
            let loader = null;

            if (1 < loaders.length) {
                loader = new Loader.LoaderChain(loaders);
            } else if (1 === loaders.length) {
                loader = loaders[0];
            }

            metadataFactory = new LazyLoadingMetadataFactory(loader, this._mappingCache);
        }

        const validatorFactory = this._validatorFactory || new ConstraintValidatorFactory();
        let translator = this._translator;

        if (! translator) {
            translator = new class
                extends implementationOf(TranslatorInterface, LocaleAwareInterface, TranslatorTrait) { }();
            /*
             * Force the locale to be 'en' when no translator is provided rather than relying on the Intl default locale
             * This avoids depending on Intl or the stub implementation being available. It also ensures that Jymfony
             * validation messages are pluralized properly even when the default locale gets changed because they are in
             * English.
             */
            translator.locale = 'en';
        }

        const contextFactory = new ExecutionContextFactory(translator, this._translationDomain);

        return new RecursiveValidator(contextFactory, metadataFactory, validatorFactory);
    }
}
