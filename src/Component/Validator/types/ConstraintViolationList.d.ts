declare namespace Jymfony.Component.Validator {
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;

    /**
     * Default implementation of {@ConstraintViolationListInterface}.
     */
    export class ConstraintViolationList extends implementationOf(ConstraintViolationListInterface) {
        /**
         * Creates a new constraint violation list.
         *
         * @param violations The constraint violations to add to the list
         */
        __construct(violations?: ConstraintViolationInterface[]): void;
        constructor(violations?: ConstraintViolationInterface[]);

        /**
         * Converts the violation into a string for debugging purposes.
         *
         * @returns The violation as string
         */
        toString(): string;

        /**
         * @inheritdoc
         */
        add(violation: ConstraintViolationInterface): void;

        /**
         * @inheritdoc
         */
        addAll(otherList: ConstraintViolationListInterface): void;

        /**
         * @inheritdoc
         */
        get(offset: number): ConstraintViolationInterface;

        /**
         * @inheritdoc
         */
        has(offset: number): boolean;

        /**
         * @inheritdoc
         */
        set(offset: number, violation: ConstraintViolationInterface): void;

        /**
         * @inheritdoc
         */
        remove(offset: number): void;

        [Symbol.iterator](): IterableIterator<ConstraintViolationInterface>;
        public readonly length: number;

        /**
         * Creates iterator for errors with specific codes.
         *
         * @param codes The codes to find
         *
         * @returns new instance which contains only specific errors
         */
        findByCodes(codes: string | string[]): ConstraintViolationListInterface;
    }
}
