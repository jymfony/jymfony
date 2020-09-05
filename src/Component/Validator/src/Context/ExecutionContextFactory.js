const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
const ExecutionContextFactoryInterface = Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface;

/**
 * Creates new {@link ExecutionContext} instances.
 *
 * @memberOf Jymfony.Component.Validator.Context
 */
export default class ExecutionContextFactory extends implementationOf(ExecutionContextFactoryInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Translation.TranslatorInterface} translator
     * @param {string} translationDomain
     */
    __construct(translator, translationDomain = null) {
        /**
         * @type {Jymfony.Contracts.Translation.TranslatorInterface}
         *
         * @private
         */
        this._translator = translator;

        /**
         * @type {string}
         *
         * @private
         */
        this._translationDomain = translationDomain;
    }

    /**
     * @inheritdoc
     */
    createContext(validator, root) {
        return new ExecutionContext(
            validator,
            root,
            this._translator,
            this._translationDomain
        );
    }
}
