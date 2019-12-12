const Alias = Jymfony.Component.DependencyInjection.Alias;
const ServiceClosureArgument = Jymfony.Component.DependencyInjection.Argument.ServiceClosureArgument;
const ServiceLocatorArgument = Jymfony.Component.DependencyInjection.Argument.ServiceLocatorArgument;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceLocator = Jymfony.Component.DependencyInjection.ServiceLocator;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ServiceLocatorTagPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof ServiceLocatorArgument) {
            return __self.register(this._container, value.values);
        }

        if (! (value instanceof Definition) || ! value.hasTag('container.service_locator')) {
            return super._processValue(value, isRoot);
        }

        if (! value.getClass()) {
            value.setClass(ServiceLocator);
        }

        const valueArguments = value.getArguments();
        if (! isArray(valueArguments[0]) && ! isObjectLiteral(valueArguments[0])) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Invalid definition for service "%s": an array of references is expected as first argument when the "container.service_locator" tag is set.', this._currentId
            ));
        }

        const isArgumentArray = isArray(valueArguments[0]);
        const finalArguments = HashTable.fromObject(valueArguments[0]);

        for (let [ k, v ] of __jymfony.getEntries(valueArguments[0])) {
            if (v instanceof ServiceClosureArgument) {
                continue;
            }

            if (! (v instanceof Reference)) {
                throw new InvalidArgumentException(__jymfony.sprintf(
                    'Invalid definition for service "%s": an array of references is expected as first argument when the "container.service_locator" tag is set, "%s" found for key "%s".',
                    this._currentId, isObject(v) ? ReflectionClass.getClassName(v) : typeof v, k
                ));
            }

            if (isArgumentArray) {
                k = v.toString();
            }

            finalArguments.put(k, new ServiceClosureArgument(v));
        }

        value.setArguments([ Object.ksort(finalArguments.toObject()) ]);
        const id = '.service_locator.' + ContainerBuilder.hash(value);

        if (isRoot) {
            if (id !== this._currentId) {
                this._container.setAlias(id, new Alias(this._currentId, false));
            }

            return value;
        }

        this._container.setDefinition(id, value.setPublic(false));

        return new Reference(id);
    }

    static register(container, refMap, callerId) {
        for (const [ id, ref ] of __jymfony.getEntries(refMap)) {
            if (! (ref instanceof Reference)) {
                throw new InvalidArgumentException(__jymfony.sprintf(
                    'Invalid service locator definition: only services can be referenced, "%s" found for key "%s". Inject parameter values using constructors instead.',
                    isObject(ref) ? ReflectionClass.getClassName(ref) : typeof ref,
                    id
                ));
            }

            refMap[id] = new ServiceClosureArgument(ref);
        }

        refMap = Object.ksort(refMap);

        const locator = (new Definition(ServiceLocator))
            .addArgument(refMap)
            .setPublic(false)
            .addTag('container.service_locator');

        let id;
        if (! container.has(id = '.service_locator.' + ContainerBuilder.hash(locator))) {
            container.setDefinition(id, locator);
        }

        if (callerId) {
            const locatorId = id;

            // Locators are shared when they hold the exact same list of factories;
            // To have them specialized per consumer service, we use a cloning factory
            // To derivate customized instances from the prototype one.
            container.register(id += '.' + callerId, ServiceLocator)
                .setPublic(false)
                .setFactory([ new Reference(locatorId), '_withContext' ])
                .addTag('container.service_locator_context', { 'id': callerId })
                .addArgument(callerId)
                .addArgument(new Reference('service_container'));
        }

        return new Reference(id);
    }
}
