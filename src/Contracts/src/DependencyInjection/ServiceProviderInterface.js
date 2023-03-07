const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;

/**
 * A ServiceProviderInterface exposes the identifiers and the types of services provided by a container.
 *
 * @memberOf Jymfony.Contracts.DependencyInjection
 */
class ServiceProviderInterface {
    /**
     * Returns an associative array of service types keyed by the identifiers provided by the current container.
     *
     * Examples:
     *
     *  * { logger: 'Jymfony.Contracts.Logger.LoggerInterface' } means the object provides a service named "logger" that implements Jymfony.Contracts.Logger.LoggerInterface
     *  * { foo: '?' } means the container provides service name "foo" of unspecified type
     *  * { bar: '?Bar.Baz' } means the container provides a service "bar" of type Bar.Baz | null
     *
     * @returns {Object.<string, string>} The provided service types, keyed by service names
     */
    getProvidedServices() { }
}

export default getInterface(ServiceProviderInterface, ContainerInterface);
