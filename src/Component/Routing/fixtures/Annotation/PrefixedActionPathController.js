import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
@Route({ path: '/prefix', host: 'frankdejonge.nl', condition: 'lol=fun' })
export default class PrefixedActionPathController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
