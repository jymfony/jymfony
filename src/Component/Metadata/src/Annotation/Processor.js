const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * @memberOf Jymfony.Component.Metadata.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS)
class Processor {
    constructor(target) {
        this._target = target;
    }

    get target() {
        return this._target;
    }
}
