const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;
const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing
 */
export default class AnnotatedController extends AbstractController {
    @Route('/this/is/first/action')
    firstAction() { }

    @Route({ path: '/action/second', methods: 'DELETE' })
    deleteSecondAction() { }
}
