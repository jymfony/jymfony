declare namespace Jymfony.Component.DependencyInjection.Exception {
    /**
     * No entry was found in the container.
     */
    export class NotFoundExceptionInterface extends ExceptionInterface.definition implements MixinInterface {
        public static readonly definition: Newable<NotFoundExceptionInterface>;
    }
}
