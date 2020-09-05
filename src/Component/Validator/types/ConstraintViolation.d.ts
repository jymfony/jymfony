declare namespace Jymfony.Component.Validator {
    import ConstraintViolationInterface = Jymfony.Component.Validator.ConstraintViolationInterface;

    /**
     * Default implementation of {@ConstraintViolationInterface}.
     */
    export class ConstraintViolation extends implementationOf(ConstraintViolationInterface) {
        private _message: string;
        private _messageTemplate: string;
        private _parameters: Record<string, any>;
        private _plural: number | null;
        private _root: any;
        private _propertyPath: string;
        private _invalidValue: any;
        private _constraint: Constraint;
        private _code: string;
        private _cause: any;

        /**
         * Creates a new constraint violation.
         *
         * @param message The violation message as a string or a stringable object
         * @param messageTemplate The raw violation message
         * @param parameters The parameters to substitute in the raw violation message
         * @param root The value originally passed to the validator
         * @param propertyPath The property path from the root value to the invalid value
         * @param invalidValue The invalid value that caused this violation
         * @param plural The number for determining the plural form when translating the message
         * @param code The error code of the violation
         * @param constraint The failed constraint
         * @param cause The cause of the violation
         */
        __construct(message: string | object, messageTemplate: string, parameters: Record<string, any>, root: any, propertyPath: string, invalidValue: any, plural?: number | null, code?: string | null, constraint?: Constraint | null, cause?: any): void;
        constructor(message: string | object, messageTemplate: string, parameters: Record<string, any>, root: any, propertyPath: string, invalidValue: any, plural?: number | null, code?: string | null, constraint?: Constraint | null, cause?: any);

        /**
         * Converts the violation into a string for debugging purposes.
         *
         * @returns The violation as string
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        public readonly messageTemplate: string;

        /**
         * @inheritdoc
         */
        public readonly parameters: Record<string, string>

        /**
         * @inheritdoc
         */
        public readonly plural: null | number;

        /**
         * @inheritdoc
         */
        public readonly root: any;

        /**
         * @inheritdoc
         */
        public readonly propertyPath: string;

        /**
         * @inheritdoc
         */
        public readonly invalidValue: any;

        /**
         * Returns the constraint whose validation caused the violation.
         *
         * @returns The constraint or null if it is not known
         */
        public readonly constraint: Constraint | null;

        /**
         * Returns the cause of the violation.
         */
        public readonly cause: any;

        /**
         * @inheritdoc
         */
        public readonly code: string | null;
    }
}
