declare namespace Jymfony.Component.DependencyInjection {
    export class ContainerInterface {
        public static readonly definition: Newable<ContainerInterface>;

        /**
         * Finds an entry of the container by its identifier and returns it.
         *
         * @param id Identifier of the entry to look for.
         *
         * @throws {Jymfony.Component.DependencyInjection.Exception.NotFoundExceptionInterface}  No entry was found for **this** identifier.
         * @throws {Jymfony.Component.DependencyInjection.Exception.ExceptionInterface} Error while retrieving the entry.
         */
        get(id: string): any;

        /**
         * Returns true if the container can return an entry for the given identifier.
         * Returns false otherwise.
         *
         * `has(id)` returning true does not mean that `get(id)` will not throw an exception.
         * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
         *
         * @param id Identifier of the entry to look for.
         */
        has(id: string): boolean;
    }
}
