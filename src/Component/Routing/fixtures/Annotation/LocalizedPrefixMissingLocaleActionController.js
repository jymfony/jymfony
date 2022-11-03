const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: { nl: '/nl' } })
class LocalizedPrefixMissingLocaleActionController {
    @Route({ path: { nl: '/actie', en: '/action' }, name: 'action' })
    action() {
    }
}
