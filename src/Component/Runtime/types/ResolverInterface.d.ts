declare namespace Jymfony.Component.Runtime {
    export class ResolverInterface {
        public static readonly definition: Newable<ResolverInterface>;

        /**
         * Resolves the application for the runtime.
         */
        resolve(): [Function, any[]];
    }
}
