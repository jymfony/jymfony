import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { nl: '/nl', en: '/en' } })
export default class LocalizedPrefixLocalizedActionController {
    @Route({ path: { nl: '/actie', en: '/action' }, name: 'action' })
    action() {
    }
}
