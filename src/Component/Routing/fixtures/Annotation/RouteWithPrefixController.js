import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route('/prefix')
export default class RouteWithPrefixController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
