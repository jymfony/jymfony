declare namespace Jymfony.Component.Validator.Context {
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;

    /**
     * Creates instances of {@link ExecutionContextInterface}.
     *
     * You can use a custom factory if you want to customize the execution context
     * that is passed through the validation run.
     */
    class ExecutionContextFactoryInterface {
        public static readonly definition: Newable<ExecutionContextFactoryInterface>;

        /**
         * Creates a new execution context.
         *
         * @returns The new execution context
         */
        createContext(validator: ValidatorInterface, root: object): ExecutionContextInterface;
    }
}
