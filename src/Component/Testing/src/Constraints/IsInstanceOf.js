const Constraint = Jymfony.Component.Testing.Constraints.Constraint;

/**
 * Constraint that asserts that the object it is evaluated for is an instance
 * of a given class.
 *
 * The expected class name is passed in the constructor.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @final
 */
export default class IsInstanceOf extends Constraint {
    __construct(className) {
        this._class = ReflectionClass.getClass(className);
        this._className = ReflectionClass.getClassName(className) || this._class.name;
    }

    /**
     * Returns a string representation of the constraint.
     */
    toString() {
        return __jymfony.sprintf('is instance of %s "%s"', this._getType(), this._className);
    }

    /**
     * @inheritdoc
     */
    matches(other) {
        return other instanceof this._class;
    }

    /**
     * @inheritdoc
     */
    _failureDescription(other) {
        return __jymfony.sprintf('%s is an instance of %s "%s"', this.shortenedExport(other), this._getType(), this._className);
    }

    _getType() {
        try {
            const reflection = new ReflectionClass(this._className);
            if (reflection.isInterface) {
                return 'interface';
            }
        } catch (e) {
        }

        return 'class';
    }
}
