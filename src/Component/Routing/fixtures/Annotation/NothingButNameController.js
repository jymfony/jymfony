const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class NothingButNameController {
    @Route({ name: 'action' })
    action() {
    }
}
