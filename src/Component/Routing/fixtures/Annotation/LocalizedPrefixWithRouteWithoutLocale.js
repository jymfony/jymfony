const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: { en: '/en', nl: '/nl' } })
class LocalizedPrefixWithRouteWithoutLocale {
    @Route({ path: '/suffix', name: 'action' })
    action() {
    }
}
