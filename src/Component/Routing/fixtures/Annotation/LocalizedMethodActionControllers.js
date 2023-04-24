const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: { en: '/the/path', nl: '/het/pad' } })
class LocalizedMethodActionControllers {
    @Route({ name: 'post', methods: [ 'POST' ] })
    post() {
    }

    @Route({ name: 'put', methods: [ 'PUT' ] })
    put() {
    }
}
