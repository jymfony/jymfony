/**
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ContainerInterface {
    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param {string} id Identifier of the entry to look for.
     *
     * @throws {Jymfony.Component.DependencyInjection.Exception.NotFoundExceptionInterface}  No entry was found for **this** identifier.
     * @throws {Jymfony.Component.DependencyInjection.Exception.ExceptionInterface} Error while retrieving the entry.
     *
     * @returns {*} Entry.
     */
    get(id) { }

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has(id)` returning true does not mean that `get(id)` will not throw an exception.
     * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
     *
     * @param {string} id Identifier of the entry to look for.
     *
     * @returns {boolean}
     */
    has(id) { }
}

module.exports = getInterface(ContainerInterface);
