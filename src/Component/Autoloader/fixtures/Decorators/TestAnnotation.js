const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Foo.Decorators
 */
export default
@Annotation()
class TestAnnotation {
    __construct(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }
}
