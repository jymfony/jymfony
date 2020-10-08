declare namespace Jymfony.Component.Validator.Context {
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
    import ExecutionContextFactoryInterface = Jymfony.Component.Validator.Context.ExecutionContextFactoryInterface;
    import TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

    /**
     * Creates new {@link ExecutionContext} instances.
     */
    export class ExecutionContextFactory extends implementationOf(ExecutionContextFactoryInterface) {
        private _translator: TranslatorInterface;
        private _translationDomain: string | null;

        /**
         * Constructor.
         */
        __construct(translator: TranslatorInterface, translationDomain?: string | null): void;
        constructor(translator: TranslatorInterface, translationDomain?: string | null);

        /**
         * @inheritdoc
         */
        createContext(validator: ValidatorInterface, root: object | null): ExecutionContextInterface;
    }
}
