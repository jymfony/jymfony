const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.Testing.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS | Annotation.ANNOTATION_TARGET_METHOD)
class TimeSensitive {
    /**
     * Constructor.
     */
    __construct() {
    }
}
