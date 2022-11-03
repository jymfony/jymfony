const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: { nl: '/nl', en: '/en' } })
class LocalizedPrefixMissingRouteLocaleActionController {
    @Route({ path: { nl: '/actie' }, name: 'action' })
    action() {
    }
}
