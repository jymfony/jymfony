import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { nl: '/nl', en: '/en' } })
export default class LocalizedPrefixMissingRouteLocaleActionController {
    @Route({ path: { nl: '/actie' }, name: "action" })
    action() {
    }
}
