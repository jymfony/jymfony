const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const NotFoundExceptionInterface = Jymfony.Component.DependencyInjection.Exception.NotFoundExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ServiceNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} id
     */
    __construct(id) {
        super.__construct('Service \''+id+'\' could not be found');
    }
}

module.exports = ServiceNotFoundException;
