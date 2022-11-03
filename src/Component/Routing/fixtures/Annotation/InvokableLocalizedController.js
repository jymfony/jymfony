const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: { nl: '/hier', en: '/here' }, name: 'action' })
class InvokableLocalizedController {
    __invoke() {
    }
}
