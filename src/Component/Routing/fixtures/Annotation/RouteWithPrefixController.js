const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route('/prefix')
class RouteWithPrefixController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
