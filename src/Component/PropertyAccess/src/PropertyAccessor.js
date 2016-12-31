const NoSuchPropertyException = Jymfony.PropertyAccess.Exception.NoSuchPropertyException;
const UnexpectedTypeException = Jymfony.PropertyAccess.Exception.UnexpectedTypeException;
const PropertyAccessorInterface = Jymfony.PropertyAccess.PropertyAccessorInterface;
const PropertyPath = Jymfony.PropertyAccess.PropertyPath;
const PropertyPathInterface = Jymfony.PropertyAccess.PropertyPathInterface;

/**
 * @namespace Jymfony.PropertyAccess
 * @type {Jymfony.PropertyAccess.PropertyAccessor}
 */
class PropertyAccessor extends implementationOf(PropertyAccessorInterface) {
    /**
     * @inheritDoc
     */
    getValue(object, path) {
        if (! (path instanceof PropertyPathInterface)) {
            path = new PropertyPath(path);
        }

        let propertyValues = this._readPropertiesUntil(object, path, path.length);

        return propertyValues[propertyValues.length - 1];
    }

    /**
     * @inheritDoc
     */
    setValue(object, value, path) {
        if (! (path instanceof PropertyPathInterface)) {
            path = new PropertyPath(path);
        }

        let propertyValues = this._readPropertiesUntil(object, path, path.length - 1);
        let target = propertyValues[propertyValues.length - 1];

        return this._writeProperty(target, path.last, value);
    }

    /**
     * Reads the path to a given path index
     *
     * @param {*} object
     * @param {Jymfony.PropertyAccess.PropertyPathInterface} propertyPath
     * @param {int} length
     */
    _readPropertiesUntil(object, propertyPath, length) {
        let propertyValues = [object];

        for (let i = 0; i < length; i++) {
            let property = propertyPath.getElement(i);
            object = this._readProperty(object, property);

            if (i + 1 < propertyPath.length && !isArray(object) && !isObject(object)) {
                throw new UnexpectedTypeException(object, propertyPath, i + 1);
            }

            propertyValues.push(object);
        }

        return propertyValues;
    }

    _readProperty(object, property) {
        if (! isObject(object)) {
            throw new NoSuchPropertyException('Cannot read property "' + property + '" from a non-object.');
        }

        let value;
        let access = this._getReadAccessInfo(object, property);

        if (PropertyAccessor.ACCESS_TYPE_METHOD === access.type) {
            value = object[access.name]();
        } else if (PropertyAccessor.ACCESS_TYPE_PROPERTY === access.type) {
            value = object[access.name];
        } else {
            throw new NoSuchPropertyException(access.name);
        }

        return value;
    }

    /**
     * @param {Object} object
     * @param {string} property
     *
     * @private
     */
    _getReadAccessInfo(object, property) {
        let reflection = new ReflectionClass(object);
        let retVal = {};

        let hasProperty = reflection.hasProperty(property) && reflection.hasReadableProperty(property);
        let camelized = this._camelize(property);

        let getter = 'get' + camelized;
        let getsetter = camelized.charAt(0).toLowerCase() + camelized.substring(1);
        let hasser = 'has' + camelized;
        let isser  = 'is'  + camelized;

        if (reflection.hasMethod(getter)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = getter;
        } else if (reflection.hasMethod(getsetter)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = getsetter;
        } else if (reflection.hasMethod(hasser)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = hasser;
        } else if (reflection.hasMethod(isser)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = isser;
        } else if (hasProperty || object.hasOwnProperty(property)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_PROPERTY;
            retVal.name = property;
        } else {
            let methods = '"' + [getter, getsetter, hasser, isser].join('()", ') + '()"';

            retVal.type = PropertyAccessor.ACCESS_TYPE_NOT_FOUND;
            retVal.name =
                'Neither the property "' + property + '" nor one of the methods ' + methods +
                ' exist in class "' + (reflection.name || object.constructor.name) + '".';
        }

        return retVal;
    }

    _writeProperty(object, property, value) {
        if (! isObject(object)) {
            throw new NoSuchPropertyException('Cannot write property "' + property + '" from a non-object.');
        }

        let retVal = object;
        let access = this._getWriteAccessInfo(object, property, value);

        if (PropertyAccessor.ACCESS_TYPE_METHOD === access.type) {
            retVal = object[access.name](value);
        } else if (PropertyAccessor.ACCESS_TYPE_PROPERTY === access.type) {
            object[access.name] = value;
        } else {
            throw new NoSuchPropertyException(access.name);
        }

        return retVal;
    }

    /**
     * @param {Object} object
     * @param {string} property
     * @param {*} value
     *
     * @private
     */
    _getWriteAccessInfo(object, property, value) {
        let reflection = new ReflectionClass(object);
        let retVal = {};

        let hasProperty = reflection.hasProperty(property) && reflection.hasWritableProperty(property);
        let camelized = this._camelize(property);

        let setter = 'set' + camelized;
        let getsetter = camelized.charAt(0).toLowerCase() + camelized.substring(1);

        if (reflection.hasMethod(setter)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = setter;
        } else if (reflection.hasMethod(getsetter)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_METHOD;
            retVal.name = getsetter;
        } else if (hasProperty || object.hasOwnProperty(property)) {
            retVal.type = PropertyAccessor.ACCESS_TYPE_PROPERTY;
            retVal.name = property;
        } else {
            let methods = '"' + [getter, getsetter, hasser, isser].join('()", ') + '()"';

            retVal.type = PropertyAccessor.ACCESS_TYPE_NOT_FOUND;
            retVal.name =
                'Neither the property "' + property + '" nor one of the methods ' + methods +
                ' exist in class "' + (reflection.name || object.constructor.name) + '".';
        }

        return retVal;
    }

    _camelize(string) {
        return string
            .replace(/_/g, ' ')
            .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, $1 => $1.toUpperCase())
            .replace(/ /g, '');
    }
}

PropertyAccessor.ACCESS_TYPE_METHOD = 'method';
PropertyAccessor.ACCESS_TYPE_PROPERTY = 'property';
PropertyAccessor.ACCESS_TYPE_NOT_FOUND = 'not_found';

module.exports = PropertyAccessor;