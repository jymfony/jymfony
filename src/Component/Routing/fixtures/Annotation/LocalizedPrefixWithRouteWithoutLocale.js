import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { en: '/en', nl: '/nl' } })
export default class LocalizedPrefixWithRouteWithoutLocale {
    @Route({ path: '/suffix', name: 'action' })
    action() {
    }
}
