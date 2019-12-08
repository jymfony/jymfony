import { @Route } from '@jymfony/decorators';

const AbstractController = Jymfony.Bundle.FrameworkBundle.Controller.AbstractController;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing
 */
export default class AnnotatedController extends AbstractController {
    @Route("/this/is/first/action")
    firstAction() { }

    @Route({ path: "/action/second", methods: "DELETE" })
    deleteSecondAction() { }
}
