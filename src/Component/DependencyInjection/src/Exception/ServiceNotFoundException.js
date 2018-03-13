const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ServiceNotFoundException extends InvalidArgumentException {
    __construct(id) {
        super.__construct('Service \''+id+'\' could not be found');
    }
}

module.exports = ServiceNotFoundException;
