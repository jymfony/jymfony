const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;
const Route = Jymfony.Component.Routing.Annotation.Route;

/**
 * POST Route annotation.
 *
 * @param {object} options
 * @param {string | Object.<string, string>} options.path
 * @param {string} [options.name]
 * @param {Object.<string, string>} [options.requirements = {}]
 * @param {Object.<string, string>} [options.options = {}]
 * @param {Object.<string, string>} [options.defaults = {}]
 * @param {string} [options.host]
 * @param {string[]} [options.schemes = ['http', 'https']]
 * @param {string} [options.condition]
 * @param {string} [options.locale]
 * @param {string} [options.format]
 *
 * @memberOf Jymfony.Component.Routing.Annotation
 */
export default
@Annotation(ANNOTATION_TARGET_CLASS | ANNOTATION_TARGET_METHOD)
class Post extends Route {
    __construct(options) {
        super.__construct(isString(options) ? { path: options, methods: [ 'POST' ] } : { ...options, methods: [ 'POST' ] });
    }
}
