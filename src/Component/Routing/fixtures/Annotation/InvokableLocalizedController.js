import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: { nl: '/hier', en: '/here' }, name: 'action' })
export default class InvokableLocalizedController {
    __invoke() {
    }
}
