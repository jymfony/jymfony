const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class TestAbstractController extends AbstractController {
    __construct(throwOnUnexpectedService = true) {
        this._container = undefined;
        this._throwOnUnexpectedService = throwOnUnexpectedService;
    }

    get container() {
        return this._container;
    }

    /**
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    set container(container) {
        if (! this._throwOnUnexpectedService) {
            this._container = container;
            return;
        }

        const expected = __self.getSubscribedServices();
        for (const id of container.getServiceIds()) {
            if ('service_container' === id) {
                continue;
            }

            if (! expected[id]) {
                throw new UnexpectedValueException(__jymfony.sprintf('Service "%s" is not expected, as declared by %s::getSubscribedServices()', id, ReflectionClass.getClassName(AbstractController)));
            }

            if (! (container.get(id) instanceof (ReflectionClass.getClass(expected[id])))) {
                throw new UnexpectedValueException(__jymfony.sprintf('Service "%s" is expected to be an instance of "%s", as declared by %s::getSubscribedServices()', id, expected[id], ReflectionClass.getClassName(AbstractController)));
            }
        }

        this._container = container;
    }

    fooAction() {
    }
}
