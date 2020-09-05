declare namespace Jymfony.Component.Validator {
    import GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;

    /**
     * Defines the interface for a group sequence provider.
     */
    export class GroupSequenceProviderInterface {
        public static readonly definition: Newable<GroupSequenceProviderInterface>;

        /**
         * Returns which validation groups should be used for a certain state
         * of the object.
         *
         * @returns An array of validation groups
         */
        public readonly groupSequence: string[] | string[][] | GroupSequence;
    }
}
