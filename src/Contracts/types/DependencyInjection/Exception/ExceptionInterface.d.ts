declare namespace Jymfony.Contracts.DependencyInjection.Exception {
    /**
     * Base interface representing an exception in a container.
     */
    export class ExceptionInterface {
        public static readonly definition: Newable<ExceptionInterface>;
    }
}
