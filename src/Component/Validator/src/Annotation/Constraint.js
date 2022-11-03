const Annotation = Jymfony.Component.Autoloader.Decorator.Annotation;

/**
 * Constraint annotation.
 *
 * @param {string|Function} class_
 * @param {object} options
 *
 * @memberOf Jymfony.Component.Validator.Annotation
 */
export default
@Annotation(Annotation.ANNOTATION_TARGET_CLASS)
class Constraint {
    __construct(class_, options = null) {
        this._class = new ReflectionClass(class_);
        if (! this._class.isSubclassOf('Jymfony.Component.Validator.Constraint')) {
            throw new LogicException(__jymfony.sprintf('Class %s is not a constraint.', this._class.name));
        }

        this._options = options ? { ...options } : options;
    }

    /**
     * Generates a new constraint object.
     *
     * @returns {Jymfony.Component.Validator.Constraint}
     */
    generateConstraint() {
        return this._class.newInstance(this._options);
    }
}
