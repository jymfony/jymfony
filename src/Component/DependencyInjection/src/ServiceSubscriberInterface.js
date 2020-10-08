/**
 * A ServiceSubscriber exposes its dependencies via the static {@link getSubscribedServices} method.
 *
 * The getSubscribedServices method returns a generator of service types required by such instances,
 * optionally keyed by the service names used internally. Service types that start with an interrogation
 * mark "?" are optional, while the other ones are mandatory service dependencies.
 *
 * The injected service locators SHOULD NOT allow access to any other services not specified by the method.
 *
 * It is expected that ServiceSubscriber instances consume service locators internally.
 * This interface does not dictate any injection method for these service locators, although constructor
 * injection is recommended.
 *
 * @memberOf Jymfony.Component.DependencyInjection
 */
class ServiceSubscriberInterface {
    /**
     * Returns an array of service types required by such instances, optionally keyed by the service names used internally.
     *
     * For mandatory dependencies:
     *
     *  * yield [ 'logger', 'Jymfony.Contracts.Logger.LoggerInterface' ] means the objects use the "logger" name
     *    internally to fetch a service which must implement Jymfony.Contracts.Logger.LoggerInterface.
     *  * yield [ 'loggers', 'Jymfony.Contracts.Logger.LoggerInterface[]' ] means the objects use the "loggers" name
     *    internally to fetch an iterable of Jymfony.Contracts.Logger.LoggerInterface instances.
     *  * yield 'Jymfony.Contracts.Logger.LoggerInterface' is a shortcut for
     *  * yield [ 'Jymfony.Contracts.Logger.LoggerInterface', 'Jymfony.Contracts.Logger.LoggerInterface' ]
     *
     * otherwise:
     *
     *  * yield [ 'logger', '?Jymfony.Contracts.Logger.LoggerInterface' ] denotes an optional dependency
     *  * yield [ 'loggers', '?Jymfony.Contracts.Logger.LoggerInterface[]' ] denotes an optional iterable dependency
     *  * yield '?Jymfony.Contracts.Logger.LoggerInterface' is a shortcut for
     *  * yield [ 'Jymfony.Contracts.Logger.LoggerInterface', '?Jymfony.Contracts.Logger.LoggerInterface' ]
     *
     * @returns {IterableIterator<string|string[]>} The required service types, optionally keyed by service names
     */
    static * getSubscribedServices() { }
}

export default getInterface(ServiceSubscriberInterface);
