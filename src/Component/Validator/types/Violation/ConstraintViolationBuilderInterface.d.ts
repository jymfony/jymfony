declare namespace Jymfony.Component.Validator.Violation {
    /**
     * Builds {@link Jymfony.Component.Validator.ConstraintViolationInterface}
     * objects.
     *
     * Use the various methods on this interface to configure the built violation.
     * Finally, call {@link addViolation()} to add the violation to the current
     * execution context.
     */
    export class ConstraintViolationBuilderInterface {
        public static readonly definition: Newable<ConstraintViolationBuilderInterface>;

        /**
         * Stores the property path at which the violation should be generated.
         *
         * The passed path will be appended to the current property path of the
         * execution context.
         *
         * @param path The property path
         */
        atPath(path: string): ConstraintViolationBuilderInterface;

        /**
         * Sets a parameter to be inserted into the violation message.
         *
         * @param key The name of the parameter
         * @param value The value to be inserted in the parameter's place
         */
        setParameter(key: string, value: string): ConstraintViolationBuilderInterface;

        /**
         * Sets all parameters to be inserted into the violation message.
         *
         * @param parameters An object with the parameter names as keys and
         *                   the values to be inserted in their place as values
         */
        setParameters(parameters: Record<string, string>): ConstraintViolationBuilderInterface;

        /**
         * Sets the translation domain which should be used for translating the
         * violation message.
         *
         * @param translationDomain The translation domain
         *
         * @see Jymfony.Contracts.Translation.TranslatorInterface
         */
        setTranslationDomain(translationDomain: string): ConstraintViolationBuilderInterface;

        /**
         * Sets the invalid value that caused this violation.
         *
         * @param invalidValue The invalid value
         */
        setInvalidValue(invalidValue: any): ConstraintViolationBuilderInterface;

        /**
         * Sets the number which determines how the plural form of the violation
         * message is chosen when it is translated.
         *
         * @param number The number for determining the plural form
         *
         * @see Jymfony.Contracts.Translation.TranslatorInterface.trans()
         */
        setPlural(number: number): ConstraintViolationBuilderInterface;

        /**
         * Sets the violation code.
         *
         * @param code The violation code
         */
        setCode(code: string | null): ConstraintViolationBuilderInterface;

        /**
         * Sets the cause of the violation.
         *
         * @param cause The cause of the violation
         */
        setCause(cause: any): ConstraintViolationBuilderInterface;

        /**
         * Adds the violation to the current execution context.
         */
        addViolation(): void;
    }
}
