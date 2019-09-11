const NoSuchPropertyException = Jymfony.Component.PropertyAccess.Exception.NoSuchPropertyException;
const UnexpectedTypeException = Jymfony.Component.PropertyAccess.Exception.UnexpectedTypeException;
const PropertyAccessorInterface = Jymfony.Component.PropertyAccess.PropertyAccessorInterface;
const PropertyPath = Jymfony.Component.PropertyAccess.PropertyPath;
const PropertyPathInterface = Jymfony.Component.PropertyAccess.PropertyPathInterface;

const CACHE_PREFIX_READ = 'r';
const CACHE_PREFIX_WRITE = 'w';
const CACHE_PREFIX_PROPERTY_PATH = 'p';

/**
 * @memberOf Jymfony.Component.PropertyAccess
 */
export default class PropertyAccessor extends implementationOf(PropertyAccessorInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Cache.CacheItemPoolInterface} [cacheItemPool]
     */
    __construct(cacheItemPool = undefined) {
        if (undefined !== cacheItemPool &&
            (isGeneratorFunction(cacheItemPool.getItem) || isGeneratorFunction(cacheItemPool.save) ||
                isAsyncFunction(cacheItemPool.getItem) || isAsyncFunction(cacheItemPool.save))
        ) {
            throw new InvalidArgumentException('PropertyAccessor needs a synchronized cache item pool to work properly');
        }

        /**
         * @type {Jymfony.Component.Cache.CacheItemPoolInterface}
         *
         * @private
         */
        this._cacheItemPool = cacheItemPool;
    }

    /**
     * @inheritdoc
     */
    getValue(object, path) {
        if (! String(path).match(/\[\./) && (isObject(object) || isArray(object))) {
            return this._readProperty(object, String(path));
        }

        path = this._getPropertyPath(path);
        const propertyValues = this._readPropertiesUntil(object, path, path.length);

        return propertyValues[propertyValues.length - 1];
    }

    /**
     * @inheritdoc
     */
    setValue(object, value, path) {
        if (! String(path).match(/\[\./) && (isObject(object) || isArray(object))) {
            return this._writeProperty(object, String(path), value);
        }

        path = this._getPropertyPath(path);
        const propertyValues = this._readPropertiesUntil(object, path, path.length - 1);
        const target = propertyValues[propertyValues.length - 1];

        return this._writeProperty(target, path.last, value);
    }

    /**
     * Reads the path to a given path index
     *
     * @param {Object} object
     * @param {Jymfony.Component.PropertyAccess.PropertyPathInterface} propertyPath
     * @param {int} length
     *
     * @returns {*}
     */
    _readPropertiesUntil(object, propertyPath, length) {
        const propertyValues = [ object ];

        for (let i = 0; i < length; i++) {
            const property = propertyPath.getElement(i);
            object = this._readProperty(object, property);

            if (i + 1 < propertyPath.length && !isArray(object) && !isObject(object)) {
                throw new UnexpectedTypeException(object, propertyPath, i + 1);
            }

            propertyValues.push(object);
        }

        return propertyValues;
    }

    /**
     * @param {Object} object
     * @param {string} property
     *
     * @returns {*}
     *
     * @private
     */
    _readProperty(object, property) {
        if (! isObject(object)) {
            throw new NoSuchPropertyException('Cannot read property "' + property + '" from a non-object.');
        }

        let value;
        const access = this._getReadAccessInfo(object, property);

        if (__self.ACCESS_TYPE_METHOD === access.type) {
            value = object[access.name]();
        } else if (__self.ACCESS_TYPE_PROPERTY === access.type) {
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
     * @returns {*}
     *
     * @private
     */
    _getReadAccessInfo(object, property) {
        const reflection = new ReflectionClass(object);
        const className = reflection.name;
        let cacheItem;

        if (undefined !== className) {
            const key = (-1 !== className.indexOf('@') ? encodeURIComponent(className) : className) + '..' + property;

            if (undefined !== this._cacheItemPool) {
                cacheItem = this._cacheItemPool.getItem(CACHE_PREFIX_READ + key);
                if (cacheItem.isHit) {
                    return cacheItem.get();
                }
            }
        }

        const retVal = {};

        const hasProperty = reflection.hasProperty(property) && reflection.hasReadableProperty(property);
        const camelized = this._camelize(property);

        const getter = 'get' + camelized;
        const getsetter = camelized.charAt(0).toLowerCase() + camelized.substring(1);
        const hasser = 'has' + camelized;
        const isser = 'is' + camelized;

        if (reflection.hasMethod(getter)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = getter;
        } else if (reflection.hasMethod(getsetter)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = getsetter;
        } else if (reflection.hasMethod(hasser)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = hasser;
        } else if (reflection.hasMethod(isser)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = isser;
        } else if (hasProperty || object.hasOwnProperty(property)) {
            retVal.type = __self.ACCESS_TYPE_PROPERTY;
            retVal.name = property;
        } else {
            const methods = '"' + [ getter, getsetter, hasser, isser ].join('()", ') + '()"';

            retVal.type = __self.ACCESS_TYPE_NOT_FOUND;
            retVal.name =
                'Neither the property "' + property + '" nor one of the methods ' + methods +
                ' exist in class "' + (reflection.name || object.constructor.name) + '".';
        }

        if (cacheItem) {
            this._cacheItemPool.save(cacheItem.set(retVal));
        }

        return retVal;
    }

    /**
     * @param {Object} object
     * @param {string} property
     * @param {*} value
     *
     * @returns {*}
     *
     * @private
     */
    _writeProperty(object, property, value) {
        if (! isObject(object)) {
            throw new NoSuchPropertyException('Cannot write property "' + property + '" from a non-object.');
        }

        let retVal = object;
        const access = this._getWriteAccessInfo(object, property, value);

        if (__self.ACCESS_TYPE_METHOD === access.type) {
            retVal = object[access.name](value);
        } else if (__self.ACCESS_TYPE_PROPERTY === access.type) {
            object[access.name] = value;
        } else {
            throw new NoSuchPropertyException(access.name);
        }

        return retVal;
    }

    /**
     * @param {Object} object
     * @param {string} property
     *
     * @private
     */
    _getWriteAccessInfo(object, property) {
        const reflection = new ReflectionClass(object);
        const className = reflection.name;

        let cacheItem;
        if (undefined !== className) {
            const key = (-1 !== className.indexOf('@') ? encodeURIComponent(className) : className) + '..' + property;

            if (undefined !== this._cacheItemPool) {
                cacheItem = this._cacheItemPool.getItem(CACHE_PREFIX_WRITE + key);
                if (cacheItem.isHit) {
                    return cacheItem.get();
                }
            }
        }

        const retVal = {};

        const hasProperty = reflection.hasProperty(property) && reflection.hasWritableProperty(property);
        const camelized = this._camelize(property);

        const setter = 'set' + camelized;
        const getsetter = camelized.charAt(0).toLowerCase() + camelized.substring(1);

        if (reflection.hasMethod(setter)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = setter;
        } else if (reflection.hasMethod(getsetter)) {
            retVal.type = __self.ACCESS_TYPE_METHOD;
            retVal.name = getsetter;
        } else if (hasProperty || object.hasOwnProperty(property)) {
            retVal.type = __self.ACCESS_TYPE_PROPERTY;
            retVal.name = property;
        } else {
            const methods = '"' + [ setter, getsetter ].join('()", ') + '()"';

            retVal.type = __self.ACCESS_TYPE_NOT_FOUND;
            retVal.name =
                'Neither the property "' + property + '" nor one of the methods ' + methods +
                ' exist in class "' + (reflection.name || object.constructor.name) + '".';
        }

        if (cacheItem) {
            this._cacheItemPool.save(cacheItem.set(retVal));
        }

        return retVal;
    }

    /**
     * Gets a PropertyPath instance and caches it.
     *
     * @param {string|Jymfony.Component.PropertyAccessor.PropertyPathInterface} path
     *
     * @returns {Jymfony.Component.PropertyAccessor.PropertyPathInterface}
     */
    _getPropertyPath(path) {
        if (path instanceof PropertyPathInterface) {
            return path;
        }

        let cacheItem;
        if (undefined !== this._cacheItemPool) {
            cacheItem = this._cacheItemPool.getItem(CACHE_PREFIX_PROPERTY_PATH + path);
            if (cacheItem.isHit) {
                return cacheItem.get();
            }
        }

        const propertyPath = new PropertyPath(path);
        if (cacheItem) {
            this._cacheItemPool.save(cacheItem.set(propertyPath));
        }

        return propertyPath;
    }

    /**
     * @param {string} string
     *
     * @returns {string}
     *
     * @private
     */
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
