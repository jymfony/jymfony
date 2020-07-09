const InvalidPropertyPathException = Jymfony.Component.PropertyAccess.Exception.InvalidPropertyPathException;
const OutOfBoundsException = Jymfony.Component.PropertyAccess.Exception.OutOfBoundsException;
const PropertyPathInterface = Jymfony.Component.PropertyAccess.PropertyPathInterface;
const PropertyPathIterator = Jymfony.Component.PropertyAccess.PropertyPathIterator;

/**
 * @memberOf Jymfony.Component.PropertyAccess
 */
export default class PropertyPath extends implementationOf(PropertyPathInterface) {
    /**
     * Constructor.
     *
     * @param {string|Jymfony.Component.PropertyAccess.PropertyPath} propertyPath
     */
    __construct(propertyPath) {
        this._elements = [];
        this._length = undefined;
        this._isIndex = [];
        this._pathAsString = undefined;

        // Can be used as copy constructor
        if (propertyPath instanceof __self) {
            this._elements = [ ...propertyPath._elements ];
            this._length = propertyPath._length;
            this._isIndex = [ ...propertyPath._isIndex ];
            this._pathAsString = propertyPath._pathAsString;

            return;
        }
        if (! isString(propertyPath)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'The property path constructor needs a string or an instance ' +
                'of "Jymfony.Component.PropertyAccess.PropertyPath". Got: "%s"',
                __jymfony.get_debug_type(propertyPath)
            ));
        }

        if ('' === propertyPath) {
            throw new InvalidPropertyPathException('The property path should not be empty.');
        }

        this._pathAsString = propertyPath;
        let position = 0;
        let remaining = propertyPath;

        // First element is evaluated differently - no leading dot for properties
        let pattern = /^(([^.\[]+)|\[([^\]]+)])(.*)/, matches;

        while ((matches = pattern.exec(remaining))) {
            let element;
            if (!! matches[2]) {
                element = matches[2];
                this._isIndex.push(false);
            } else {
                element = matches[3];
                this._isIndex.push(true);
            }

            this._elements.push(element);

            position += matches[1].length;
            remaining = matches[4];
            pattern = /^(\.([^.|\[]+)|\[([^\]]+)])(.*)/;
        }

        if ('' !== remaining) {
            throw new InvalidPropertyPathException(__jymfony.sprintf(
                'Could not parse property path "%s". Unexpected token "%s" at position %d',
                propertyPath,
                remaining[0],
                position
            ));
        }

        this._length = this._elements.length;
    }

    /**
     * @inheritdoc
     */
    toString() {
        return this._pathAsString;
    }

    /**
     * @inheritdoc
     */
    get length() {
        return this._length;
    }

    /**
     * @inheritdoc
     */
    get parent() {
        if (1 >= this._length) {
            return undefined;
        }

        const parent = new __self(this);

        --parent._length;
        parent._pathAsString = parent._pathAsString.substr(
            0,
            Math.max(parent._pathAsString.lastIndexOf('.'), parent._pathAsString.lastIndexOf('['))
        );

        parent._elements.pop();
        parent._isIndex.pop();

        return parent;
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
    get elements() {
        return [ ...this._elements ];
    }

    /**
     * Returns a new iterator for this path.
     *
     * @returns {Jymfony.Component.PropertyAccess.PropertyPathIteratorInterface}
     */
    [Symbol.iterator]() {
        return new PropertyPathIterator(this);
    }

    /**
     * @inheritdoc
     */
    isProperty(index) {
        if (undefined === this._isIndex[index]) {
            throw new OutOfBoundsException(__jymfony.sprintf('The index %s is not within the property path', index));
        }

        return ! this._isIndex[index];
    }

    /**
     * @inheritdoc
     */
    isIndex(index) {
        if (undefined === this._isIndex[index]) {
            throw new OutOfBoundsException(__jymfony.sprintf('The index %s is not within the property path', index));
        }

        return this._isIndex[index];
    }

    /**
     * @inheritdoc
     */
    get last() {
        return this._elements[this.length - 1];
    }
}
