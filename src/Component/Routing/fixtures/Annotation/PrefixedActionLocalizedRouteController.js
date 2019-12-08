import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route('/prefix')
export default class PrefixedActionLocalizedRouteController {
    @Route({ path: { en: '/path', nl: '/pad' }, name: 'action' })
    action() {
    }
}
