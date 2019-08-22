const ExceptionInterface = Jymfony.Component.DependencyInjection.Exception.ExceptionInterface;

/**
 * No entry was found in the container.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class NotFoundExceptionInterface extends ExceptionInterface.definition {
}

export default getInterface(NotFoundExceptionInterface);
