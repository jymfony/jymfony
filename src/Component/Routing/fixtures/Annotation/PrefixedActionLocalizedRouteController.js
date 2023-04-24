const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route('/prefix')
class PrefixedActionLocalizedRouteController {
    @Route({ path: { en: '/path', nl: '/pad' }, name: 'action' })
    action() {
    }
}
