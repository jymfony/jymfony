const ExecutionContext = Jymfony.Component.Validator.Context.ExecutionContext;
const ExecutionContextFactoryInterface = Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface;

/**
 * Creates new {@link ExecutionContext} instances.
 *
 * @memberOf Jymfony.Component.Validator.Context
 */
export default class ExecutionContextFactory extends implementationOf(ExecutionContextFactoryInterface) {
    /**
     * @type {Jymfony.Contracts.Translation.TranslatorInterface}
     *
     * @private
     */
    _translator;

    /**
     * @type {string}
     *
     * @private
     */
    _translationDomain;

    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Translation.TranslatorInterface} translator
     * @param {string} translationDomain
     */
    __construct(translator, translationDomain = null) {
        this._translator = translator;
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
