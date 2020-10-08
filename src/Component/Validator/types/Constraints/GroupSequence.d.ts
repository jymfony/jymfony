declare namespace Jymfony.Component.Validator.Constraints {
    /**
     * A sequence of validation groups.
     *
     * When validating a group sequence, each group will only be validated if all
     * of the previous groups in the sequence succeeded. For example:
     *
     *     validator.validate(address, null, new GroupSequence(['Basic', 'Strict']));
     *
     * In the first step, all constraints that belong to the group "Basic" will be
     * validated. If none of the constraints fail, the validator will then validate
     * the constraints in group "Strict". This is useful, for example, if "Strict"
     * contains expensive checks that require a lot of CPU or slow, external
     * services. You usually don't want to run expensive checks if any of the cheap
     * checks fail.
     *
     * When adding metadata to a class, you can override the "Default" group of
     * that class with a group sequence:
     *
     *     @GroupSequence(["Address", "Strict"])
     *     class Address {
     *         // ...
     *     }
     *
     * Whenever you validate that object in the "Default" group, the group sequence
     * will be validated:
     *
     *     validator.validate(address);
     *
     * If you want to execute the constraints of the "Default" group for a class
     * with an overridden default group, pass the class name as group name instead:
     *
     *     validator.validate(address, null, "Address");
     */
    export class GroupSequence {
        /**
         * The groups in the sequence.
         */
        groups: string[] | string[][] | Record<string, string[]> | GroupSequence[];

        /**
         * The group in which cascaded objects are validated when validating
         * this sequence.
         *
         * By default, cascaded objects are validated in each of the groups of
         * the sequence.
         *
         * If a class has a group sequence attached, that sequence replaces the
         * "Default" group. When validating that class in the "Default" group, the
         * group sequence is used instead, but still the "Default" group should be
         * cascaded to other objects.
         */
        cascadedGroup: null | string | GroupSequence;

        /**
         * Creates a new group sequence.
         */
        __construct(groups: string[] | string[][] | Record<string, string[]> | GroupSequence[]): void;
        constructor(groups: string[] | string[][] | Record<string, string[]> | GroupSequence[]);
    }
}
