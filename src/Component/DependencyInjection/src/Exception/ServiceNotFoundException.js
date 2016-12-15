const InvalidArgumentException = Jymfony.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.DependencyInjection.Exception
 */
class ServiceNotFoundException extends InvalidArgumentException {
    constructor(id) {
        super("Service '"+id+"' could not be found");
    }
}

module.exports = ServiceNotFoundException;
