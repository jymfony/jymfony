const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route('/the/path')
class MethodActionControllers {
    @Route({ name: 'post', methods: [ 'POST' ] })
    post() {
    }

    @Route({ name: 'put', methods: [ 'PUT' ] })
    put() {
    }
}
