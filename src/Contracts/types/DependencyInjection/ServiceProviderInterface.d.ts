declare namespace Jymfony.Contracts.DependencyInjection {
    /**
     * A ServiceProviderInterface exposes the identifiers and the types of services provided by a container.
     */
    export class ServiceProviderInterface {
        /**
         * Returns an associative array of service types keyed by the identifiers provided by the current container.
         *
         * Examples:
         *
         *  * { logger: 'Jymfony.Contracts.Logger.LoggerInterface' } means the object provides a service named "logger" that implements Jymfony.Contracts.Logger.LoggerInterface
         *  * { foo: '?' } means the container provides service name "foo" of unspecified type
         *  * { bar: '?Bar.Baz' } means the container provides a service "bar" of type Bar.Baz | null
         *
         * @returns The provided service types, keyed by service names
         */
        getProvidedServices(): Record<string, string>;
    }
}
