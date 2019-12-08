import { @Route } from '@jymfony/decorators';

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class NothingButNameController {
    @Route({ name: "action" })
    action() {
    }
}
