const ControllerMetadata = Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata;
const InvalidArgumentException = Jymfony.Contracts.Metadata.Exception.InvalidArgumentException;
const MetadataFactoryInterface = Jymfony.Contracts.Metadata.MetadataFactoryInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Controller.Metadata
 */
export default class ArgumentMetadataFactory extends implementationOf(MetadataFactoryInterface) {
    /**
     * @type {WeakMap.<Function, Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata>}
     *
     * @private
     */
    _instances;

    __construct() {
        this._instances = new WeakMap();
    }

    /**
     * @inheritdoc
     */
    getMetadataFor(controller) {
        const reflectionMethod = this._getReflectionMethod(controller);
        if (null === reflectionMethod) {
            throw InvalidArgumentException.create('Cannot retrieve metadata for passed controller.');
        }

        if (this._instances.has(reflectionMethod.method)) {
            return this._instances.get(reflectionMethod.method);
        }

        const metadata = new ControllerMetadata(reflectionMethod);
        this._instances.set(reflectionMethod.method, metadata);

        return metadata;
    }

    /**
     * @inheritdoc
     */
    hasMetadataFor(controller) {
        return null !== this._getReflectionMethod(controller);
    }

    /**
     * Gets the ReflectionMethod object from the controller.
     *
     * @param {Function} controller
     *
     * @returns {ReflectionMethod}
     *
     * @private
     */
    _getReflectionMethod(controller) {
        let innerObject;

        try {
            innerObject = controller.innerObject; // BoundFunction
        } catch {
            // Do nothing.
        }

        if (!! innerObject) {
            controller = [ innerObject.getObject(), innerObject.getFunction().name ];
        }

        if ('function' === typeof controller && ! ReflectionClass.exists(controller)) {
            return null;
        }

        if (isCallableArray(controller)) {
            return new ReflectionClass(controller[0]).getMethod(controller[1]);
        }

        if (isFunction(controller) && isFunction(controller.__invoke)) {
            return new ReflectionClass(controller).getMethod('__invoke');
        }

        return null;
    }
}
