const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * @memberOf Jymfony.Component.Routing.Fixtures.Annotation
 */
export default
@Route({ path: '/defaults', locale: 'g_locale', format: 'g_format' })
class GlobalDefaultsClass {
    @Route({ path: '/specific-locale', name: 'specific_locale', locale: 's_locale' })
    locale() {
    }

    @Route({ path: '/specific-format', name: 'specific_format', format: 's_format' })
    format() {
    }
}
