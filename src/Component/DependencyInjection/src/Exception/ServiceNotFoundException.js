const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const NotFoundExceptionInterface = Jymfony.Contracts.DependencyInjection.Exception.NotFoundExceptionInterface;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Exception
 */
export default class ServiceNotFoundException extends mix(InvalidArgumentException, NotFoundExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} id
     * @param {string} [sourceId]
     */
    __construct(id, sourceId = undefined) {
        let msg;
        if (! sourceId) {
            msg = __jymfony.sprintf('You have requested a non-existent service "%s".', id);
        } else {
            msg = __jymfony.sprintf('The service "%s" has a dependency on a non-existent service "%s".', sourceId, id);
        }

        super.__construct(msg);
    }
}
