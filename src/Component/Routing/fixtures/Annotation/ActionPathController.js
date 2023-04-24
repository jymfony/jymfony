const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class ActionPathController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
