const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
class ServiceNotFoundException extends InvalidArgumentException {
    constructor(id) {
        super("Service '"+id+"' could not be found");
    }
}

module.exports = ServiceNotFoundException;
