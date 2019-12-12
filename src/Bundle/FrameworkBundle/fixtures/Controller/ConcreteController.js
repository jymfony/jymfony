import { @Inject } from '@jymfony/decorators';

const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller
 */
export default class ConcreteController extends AbstractController {
    get container() {
        return this._container;
    }

    @Inject(ContainerInterface)
    set container(container) {
        super.container = container;
    }
}
