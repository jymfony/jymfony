const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: '/1', name: 'route1', schemes: [ 'https' ], methods: [ 'GET' ] })
@Route({ path: '/2', name: 'route2', schemes: [ 'https' ], methods: [ 'GET' ] })
class BazClass {
    __invoke() { }
}
