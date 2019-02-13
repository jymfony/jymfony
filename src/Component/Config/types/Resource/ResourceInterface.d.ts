declare namespace Jymfony.Component.Config.Resource {
    export class ResourceInterface implements MixinInterface {
        public static readonly definition: Newable<ResourceInterface>;

        /**
         * Returns a string representation of the Resource.
         *
         * This method is necessary to allow for resource de-duplication.
         * The string returned need not have a particular meaning, but has
         * to be identical for different ResourceInterface instances
         * referring to the same resource; and it should be unlikely to
         * collide with that of other, unrelated resource instances.
         *
         * @returns A string representation unique to the underlying Resource
         */
        toString(): string;
    }
}
