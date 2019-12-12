import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class ActionPathController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
