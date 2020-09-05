declare namespace Jymfony.Component.Validator.Context {
    import Constraint = Jymfony.Component.Validator.Constraint;
    import ConstraintViolationBuilder = Jymfony.Component.Validator.Violation.ConstraintViolationBuilder;
    import ExecutionContextInterface = Jymfony.Component.Validator.Context.ExecutionContextInterface;
    import ValidatorInterface = Jymfony.Component.Validator.Validator.ValidatorInterface;
    import TranslatorInterface = Jymfony.Contracts.Translation.TranslatorInterface;
    import MetadataInterface = Jymfony.Contracts.Metadata.MetadataInterface;
    import ContextualValidatorInterface = Jymfony.Component.Validator.Validator.ContextualValidatorInterface;

    /**
     * The context used and created by {@link ExecutionContextFactory}.
     *
     * @see ExecutionContextInterface
     *
     * @internal Code against ExecutionContextInterface instead.
     */
    export class ExecutionContext extends implementationOf(ExecutionContextInterface) {
        private _validator: ValidatorInterface;
        private _root: any;
        private _translator: TranslatorInterface;
        private _translationDomain: string | null;

        /**
         * The violations generated in the current context.
         */
        private _violations: ConstraintViolationListInterface;

        /**
         * The currently validated value.
         */
        private _value: any;

        /**
         * The currently validated object.
         */
        private _object: object;

        /**
         * The property path leading to the current value.
         */
        private _propertyPath: string;

        /**
         * The current validation metadata.
         */
        private _metadata: MetadataInterface;

        /**
         * The currently validated group.
         */
        private _group: string | null;

        /**
         * The currently validated constraint.
         */
        private _constraint: Constraint | null;

        /**
         * Stores which objects have been validated in which group.
         */
        private _validatedObjects: WeakMap<object, any>;

        /**
         * Stores which class constraint has been validated for which object.
         */
        private _validatedConstraints: WeakMap<object, Set<string>>;

        /**
         * Stores already volidated composite/valid constraints for groups.
         */
        private _compositeValidatedConstraints: WeakMap<object, Map<string, Set<string>>>;

        /**
         * @internal Called by {@link ExecutionContextFactory}. Should not be used in user code.
         */
        __construct(validator: ValidatorInterface, root: any, translator: TranslatorInterface, translationDomain?: string | null): void;
        constructor(validator: ValidatorInterface, root: any, translator: TranslatorInterface, translationDomain?: string | null);

        /**
         * @inheritdoc
         */
        setNode(value: any, object: object, metadata: MetadataInterface, propertyPath: string): void;

        /**
         * @inheritdoc
         */
        setGroup(group: string): void;

        /**
         * @inheritdoc
         */
        setConstraint(constraint: Constraint): void;

        /**
         * @inheritdoc
         */
        addViolation(message: string, parameters?: Record<string, any>): void;

        /**
         * @inheritdoc
         */
        buildViolation(message: string, parameters?: Record<string, any>): ConstraintViolationBuilder;

        /**
         * @inheritdoc
         */
        public readonly violations: ConstraintViolationListInterface;

        /**
         * @inheritdoc
         */
        public readonly validator: ContextualValidatorInterface;

        /**
         * @inheritdoc
         */
        public readonly root: object | null;

        /**
         * @inheritdoc
         */
        public readonly value: any;

        /**
         * @inheritdoc
         */
        public readonly object: object;

        /**
         * @inheritdoc
         */
        public readonly metadata: MetadataInterface;

        /**
         * @inheritdoc
         */
        public readonly group: string;

        getConstraint(): Constraint;

        /**
         * @inheritdoc
         */
        public readonly className: string | null;

        /**
         * @inheritdoc
         */
        public readonly propertyName: string | null;

        /**
         * @inheritdoc
         */
        getPropertyPath(subPath?: string): string;

        /**
         * @inheritdoc
         */
        markGroupAsValidated(object: object, groupHash: string): void;

        /**
         * @inheritdoc
         */
        isGroupValidated(object: object, groupHash: string): boolean;

        /**
         * @inheritdoc
         */
        markConstraintAsValidated(object: object, constraint: Constraint, group: string): void;

        /**
         * @inheritdoc
         */
        isConstraintValidated(object: object, constraint: Constraint, group: string): boolean;
    }
}
