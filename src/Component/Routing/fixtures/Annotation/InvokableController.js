const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: '/here', name: 'lol', methods: [ 'GET', 'POST' ], schemes: [ 'https' ] })
class InvokableController {
    __invoke() {
    }
}
