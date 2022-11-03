const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default class LocalizedActionPathController {
    @Route({ path: {'en': '/path', 'nl': '/pad'}, name: 'action' })
    action() {
    }
}
