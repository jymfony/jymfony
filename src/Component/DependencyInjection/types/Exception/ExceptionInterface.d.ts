declare namespace Jymfony.Component.DependencyInjection.Exception {
    /**
     * Base interface representing an exception in a container.
     */
    export class ExceptionInterface implements MixinInterface {
        public static readonly definition: Newable<ExceptionInterface>;
    }
}
