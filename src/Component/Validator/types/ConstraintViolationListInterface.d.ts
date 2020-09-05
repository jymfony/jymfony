declare namespace Jymfony.Component.Validator {
    import ConstraintViolationInterface = Jymfony.Component.Validator.ConstraintViolationInterface;

    /**
     * A list of constraint violations.
     */
    export class ConstraintViolationListInterface {
        public static readonly definition: Newable<ConstraintViolationListInterface>;

        /**
         * Adds a constraint violation to this list.
         */
        add(violation: ConstraintViolationInterface): void;

        /**
         * Merges an existing violation list into this list.
         *
         * @param otherList
         */
        addAll(otherList: ConstraintViolationListInterface): void;

        /**
         * Returns the violation at a given offset.
         *
         * @param offset The offset of the violation
         *
         * @returns The violation
         *
         * @throws {OutOfBoundsException} if the offset does not exist
         */
        get(offset: number): ConstraintViolationInterface;

        /**
         * Returns whether the given offset exists.
         *
         * @param offset The violation offset
         *
         * @returns Whether the offset exists
         */
        has(offset: number): boolean;

        /**
         * Sets a violation at a given offset.
         *
         * @param offset The violation offset
         * @param violation The violation
         */
        set(offset: number, violation: ConstraintViolationInterface): void;

        /**
         * Removes a violation at a given offset.
         *
         * @param offset The offset to remove
         */
        remove(offset: number): void;

        /**
         * Get the violation list length.
         */
        public readonly length: number;
    }
}
