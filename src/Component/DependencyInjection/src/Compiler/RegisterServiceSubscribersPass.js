const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ServiceLocatorTagPass = Jymfony.Component.DependencyInjection.Compiler.ServiceLocatorTagPass;
const Container = Jymfony.Component.DependencyInjection.Container;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceSubscriberInterface = Jymfony.Component.DependencyInjection.ServiceSubscriberInterface;

/**
 * Compiler pass to register tagged services that require a service locator.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class RegisterServiceSubscribersPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Definition) || value.isAbstract() || value.isSynthetic() || ! value.hasTag('container.service_subscriber')) {
            return super._processValue(value, isRoot);
        }

        const serviceMap = {};
        let autowire = false;

        for (let attributes of value.getTag('container.service_subscriber')) {
            if (0 === Object.keys(attributes).length || (undefined === attributes.id && undefined === attributes.key)) {
                autowire = true;
                continue;
            }

            attributes = Object.ksort(attributes);
            if (!attributes.id) {
                throw new InvalidArgumentException(__jymfony.sprintf(
                    'Missing "id" attribute on "container.service_subscriber" tag with key="%s" for service "%s".',
                    attributes.key,
                    this._currentId
                ));
            }

            if (!attributes.key) {
                attributes.key = attributes.id;
            }

            if (serviceMap[attributes.key]) {
                continue;
            }

            serviceMap[attributes.key] = new Reference(attributes.id);
        }

        let Class = value.getClass();
        const r = this._container.getReflectionClass(Class, false);

        if (! r) {
            throw new InvalidArgumentException(__jymfony.sprintf('Class "%s" used for service "%s" cannot be found.', Class, this._currentId));
        }
        if (! r.isSubclassOf(ServiceSubscriberInterface)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Service "%s" must implement interface "Jymfony.Component.DependencyInjection.ServiceSubscriberInterface".', this._currentId));
        }

        Class = r.name;
        const subscriberMap = {};

        for (const subscribedService of ReflectionClass.getClass(Class).getSubscribedServices()) {
            let key, type;
            if (isString(subscribedService)) {
                key = type = subscribedService;
            } else {
                [ key, type ] = subscribedService;
            }

            key = __jymfony.ltrim(key, '?');
            if (! isString(type) || ! type.match(/^\??[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*(?:\.[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)*$/)) {
                throw new InvalidArgumentException(__jymfony.sprintf(
                    '"%s.getSubscribedServices()" must return valid types for service "%s" key "%s", "%s" returned.',
                    Class,
                    this._currentId,
                    key,
                    isString(type) ? type : typeof type
                ));
            }

            let optionalBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE;
            if ('?' === type[0]) {
                type = type.substr(1);
                optionalBehavior = Container.IGNORE_ON_INVALID_REFERENCE;
            }

            if (!serviceMap[key]) {
                if (!autowire) {
                    throw new InvalidArgumentException(__jymfony.sprintf(
                        'Service "%s" misses a "container.service_subscriber" tag with "key"/"id" attributes corresponding to entry "%s" as returned by "%s.getSubscribedServices()".',
                        this._currentId,
                        key,
                        Class
                    ));
                }

                serviceMap[key] = new Reference(type);
            }

            subscriberMap[key] = new Reference(type, optionalBehavior);
            delete serviceMap[key];
        }

        if (0 < Object.keys(serviceMap).length) {
            const message = __jymfony.sprintf(1 < serviceMap.length ? 'keys "%s" do' : 'key "%s" does', Object.keys(serviceMap).join('", "').replace(/%/g, '%%'));
            throw new InvalidArgumentException(__jymfony.sprintf('Service %s not exist in the map returned by "%s.getSubscribedServices()" for service "%s".', message, Class, this._currentId));
        }

        value.addTag('container.service_subscriber.locator', { id: ServiceLocatorTagPass.register(this._container, subscriberMap, this._currentId).toString() });

        return super._processValue(value);
    }
}
