const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.Testing.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_METHOD)
class BeforeEach {
    /**
     * Constructor.
     */
    __construct() {
    }
}
