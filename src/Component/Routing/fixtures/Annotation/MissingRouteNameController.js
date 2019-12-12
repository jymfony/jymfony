import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class MissingRouteNameController {
    @Route('/path')
    action() {
    }
}
