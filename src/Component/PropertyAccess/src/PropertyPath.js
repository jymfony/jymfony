const OutOfBoundsException = Jymfony.PropertyAccess.Exception.OutOfBoundsException;
const PropertyPathInterface = Jymfony.PropertyAccess.PropertyPathInterface;

/**
 * @namespace Jymfony.PropertyAccess
 * @type {Jymfony.PropertyAccess.PropertyPath}
 */
module.exports = class PropertyPath extends mix(undefined, PropertyPathInterface) {
    constructor(propertyPath) {
        super();

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
     * @inheritDoc
     */
    toString() {
        return this._elements.join('.');
    }

    /**
     * @inheritDoc
     */
    getElement(index) {
        if (index >= this.length) {
            throw new OutOfBoundsException('The index ' + index + ' is not within the path');
        }

        return this._elements[index];
    }

    /**
     * @inheritDoc
     */
    get length() {
        return this._elements.length;
    }

    /**
     * @inheritDoc
     */
    get last() {
        return this._elements[this.length - 1];
    }
};
