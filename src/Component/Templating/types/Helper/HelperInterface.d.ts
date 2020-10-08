declare namespace Jymfony.Component.Templating.Helper {
    /**
     * HelperInterface is the interface all helpers must implement.
     */
    export class HelperInterface {
        public static readonly definition: Newable<HelperInterface>;

        /**
         * Returns the name of this helper.
         */
        public readonly name: string;
    }
}
