declare namespace Jymfony.Component.Validator.Violation {
    import ConstraintViolationBuilderInterface = Jymfony.Component.Validator.Violation.ConstraintViolationBuilderInterface;
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
    import TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;

    /**
     * Default implementation of {@link ConstraintViolationBuilderInterface}.
     */
    export class ConstraintViolationBuilder extends implementationOf(ConstraintViolationBuilderInterface) {
        private _violations: ConstraintViolationListInterface;
        private _message: string;
        private _parameters: Record<string, any>;
        private _root: any;
        private _propertyPath: string;
        private _invalidValue: any;
        private _translator: TranslatorInterface;
        private _translationDomain: null | string;
        private _constraint: Constraint;
        private _code?: string;
        private _cause?: any;
        private _plural?: number;

        /**
         * Constructor.
         *
         * @param violations
         * @param constraint The failed constraint
         * @param message The error message as a string or a stringable object
         * @param parameters The parameters to substitute in the raw violation message
         * @param root The value originally passed to the validator
         * @param propertyPath The property path from the root value to the invalid value
         * @param invalidValue The invalid value that caused this violation
         * @param translator
         * @param translationDomain
         */
        __construct(violations: ConstraintViolationListInterface, constraint: Constraint, message: string, parameters: Record<string, any>, root: any, propertyPath: string, invalidValue: any, translator: TranslatorInterface, translationDomain?: null | string): void;
        constructor(violations: ConstraintViolationListInterface, constraint: Constraint, message: string, parameters: Record<string, any>, root: any, propertyPath: string, invalidValue: any, translator: TranslatorInterface, translationDomain?: null | string);

        /**
         * @inheritdoc
         */
        atPath(path: string): this;

        /**
         * @inheritdoc
         */
        setParameter(key: string, value: string | any): this;

        /**
         * @inheritdoc
         */
        setParameters(parameters: Record<string, any>): this;

        /**
         * @inheritdoc
         */
        setTranslationDomain(translationDomain: string): this;

        /**
         * @inheritdoc
         */
        setInvalidValue(invalidValue: any): this;

        /**
         * @inheritdoc
         */
        setPlural(number: number): this;

        /**
         * @inheritdoc
         */
        setCode(code: string): this;

        /**
         * @inheritdoc
         */
        setCause(cause: any): this;

        /**
         * @inheritdoc
         */
        addViolation(): void;
    }
}
