const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_PARAMETER | Annotation.ANNOTATION_TARGET_FIELD | Annotation.ANNOTATION_TARGET_SETTER)
class Parameter {
    __construct(parameterName) {
        this._parameterName = parameterName;
    }

    get parameterName() {
        return this._parameterName;
    }
}
