const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_PARAMETER | Annotation.ANNOTATION_TARGET_ACCESSOR | Annotation.ANNOTATION_TARGET_SETTER | Annotation.ANNOTATION_TARGET_METHOD)
class Inject {
    __construct(serviceId, invalidBehavior) {
        this._serviceId = serviceId;
        this._invalidBehavior = invalidBehavior;
    }

    get serviceId() {
        return this._serviceId;
    }

    get invalidBehavior() {
        return this._invalidBehavior;
    }
}
