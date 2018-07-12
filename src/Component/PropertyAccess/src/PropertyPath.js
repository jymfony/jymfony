const OutOfBoundsException = Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException;
const PropertyPathInterface = Jymfony.Component.PropertyAccess.PropertyPathInterface;

/**
 * @memberOf Jymfony.Component.PropertyAccess
 */
class PropertyPath extends implementationOf(PropertyPathInterface) {
    /**
     * Constructor.
     *
     * @param {string|Jymfony.Component.PropertyAccess.PropertyPath} propertyPath
     */
    __construct(propertyPath) {
        if (propertyPath instanceof PropertyPath) {
            this._elements = Array.from(propertyPath._elements);
        } else if (isString(propertyPath)) {
            if (! /[a-zA-Z0-9._]+/.test(propertyPath)) {
                throw new InvalidArgumentException(propertyPath + ' is not a valid path');
            }

            this._elements = propertyPath.split('.');
        } else {
            throw new InvalidArgumentException(
                'Argument 1 passed to PropertyPath constructor must be a string ' +
                'or an instance of PropertyPath. Got "' +
                isObject(propertyPath) ? propertyPath.constructor.name : (typeof propertyPath) + '"'
            );
        }
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._elements.join('.');
    }

    /**
     * @inheritdoc
     */
    getElement(index) {
        if (index >= this.length) {
            throw new OutOfBoundsException('The index ' + index + ' is not within the path');
        }

        return this._elements[index];
    }

    /**
     * @inheritdoc
     */
    get length() {
        return this._elements.length;
    }

    /**
     * @inheritdoc
     */
    get last() {
        return this._elements[this.length - 1];
    }
}

module.exports = PropertyPath;
