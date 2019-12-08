import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { nl: '/nl' } })
export default class LocalizedPrefixMissingLocaleActionController {
    @Route({ path: { nl: '/actie', en: '/action' }, name: "action" })
    action() {
    }
}
