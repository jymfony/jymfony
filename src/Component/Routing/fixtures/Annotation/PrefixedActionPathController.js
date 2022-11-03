const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: '/prefix', host: 'frankdejonge.nl', condition: 'lol=fun' })
class PrefixedActionPathController {
    @Route({ path: '/path', name: 'action' })
    action() {
    }
}
