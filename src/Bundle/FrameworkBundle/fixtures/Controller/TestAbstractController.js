import { @Inject } from '@jymfony/decorators';

const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

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
    @Inject(ContainerInterface)
    set container(container) {
        if (! this._throwOnUnexpectedService) {
            this._container = container;
            return;
        }

        const expected = [ ...__self.getSubscribedServices() ];
        for (const id of container.getServiceIds()) {
            if ('service_container' === id) {
                continue;
            }

            const record = expected.find(([ serviceId ]) => id === serviceId);
            if (! record) {
                throw new UnexpectedValueException(__jymfony.sprintf('Service "%s" is not expected, as declared by %s.getSubscribedServices()', id, ReflectionClass.getClassName(AbstractController)));
            }

            const class_ = record[1].startsWith('?') ? record[1].substr(1) : record[1];
            const reflClass = new ReflectionClass(container.get(id));
            if (! reflClass.isInstanceOf(class_)) {
                throw new UnexpectedValueException(__jymfony.sprintf(
                    'Service "%s" is expected to be an instance of "%s", as declared by %s.getSubscribedServices()',
                    id,
                    ReflectionClass.getClassName(class_),
                    ReflectionClass.getClassName(AbstractController)
                ));
            }
        }

        super.container = container;
    }

    fooAction() {
    }
}
