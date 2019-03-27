declare namespace Jymfony.Component.Config.Resource {
    export class SelfCheckingResourceInterface extends ResourceInterface implements MixinInterface {
        public static readonly definition: Newable<SelfCheckingResourceInterface>;

        /**
         * Returns true if the resource has not been updated since the given timestamp.
         *
         * @param timestamp The last time the resource was loaded
         *
         * @returns True if the resource has not been updated, false otherwise
         */
        isFresh(timestamp: number): boolean;
    }
}
