const Loader = Jymfony.Component.Config.Loader.Loader;
const FileResource = Jymfony.Component.Config.Resource.FileResource;
const RouteCollection = Jymfony.Component.Routing.RouteCollection;

/**
 * @memberOf Jymfony.Component.Routing.Loader
 */
export default class ServiceRouterLoader extends Loader {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.DependencyInjection.Container} container
     */
    __construct(container) {
        super.__construct();

        /**
         * @type {Jymfony.Component.DependencyInjection.Container}
         *
         * @private
         */
        this._container = container;
    }

    /**
     * @inheritdoc
     */
    load(resource) {
        const parts = resource.split(':');
        if (2 !== parts.length) {
            throw new InvalidArgumentException(__jymfony.sprintf('Invalid resource "%s" passed to the "service" route loader: use the format "service_name:methodName"', resource));
        }

        const [ service, method ] = parts;
        const object = this._container.get(service);

        const reflClass = new ReflectionClass(object);
        if (! isFunction(object[method])) {
            throw new BadMethodCallException(__jymfony.sprintf('Method "%s" not found on "%s" when importing routing resource "%s"', method, reflClass.name, resource));
        }

        const collection = getCallableFromArray([ object, method ])(this);
        if (! (collection instanceof RouteCollection)) {
            const type = isObject(collection) ? ReflectionClass.getClassName(collection) : typeof collection;

            throw new LogicException(__jymfony.sprintf('The %s::%s method must return a RouteCollection: %s returned', reflClass.name, method, type));
        }

        this._addClassResource(reflClass, collection);

        return collection;
    }

    /**
     * @inheritdoc
     */
    supports(resource, type = undefined) {
        return 'service' === type;
    }

    /**
     * Adds resources for class to the collection
     *
     * @param {ReflectionClass} reflClass
     * @param {Jymfony.Component.Routing.RouteCollection} collection
     *
     * @private
     */
    _addClassResource(reflClass, collection) {
        do {
            if (reflClass.filename) {
                collection.addResource(new FileResource(reflClass.filename));
            }
        } while ((reflClass = reflClass.getParentClass()));
    }
}
