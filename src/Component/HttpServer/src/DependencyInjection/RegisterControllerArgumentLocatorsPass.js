const ReflectionHelper = Jymfony.Component.Autoloader.Reflection.ReflectionHelper;
const ChildDefinition = Jymfony.Component.DependencyInjection.ChildDefinition;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const ServiceLocatorTagPass = Jymfony.Component.DependencyInjection.Compiler.ServiceLocatorTagPass;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const Container = Jymfony.Component.DependencyInjection.Container;
const ContainerAwareInterface = Jymfony.Component.DependencyInjection.ContainerAwareInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * Creates the service-locators required by ServiceValueResolver.
 *
 * @memberOf Jymfony.Component.HttpServer.DependencyInjection
 */
export default class RegisterControllerArgumentLocatorsPass extends implementationOf(CompilerPassInterface) {
    /**
     * Constructor.
     *
     * @param {string} resolverServiceId
     * @param {string} controllerTag
     * @param {string} controllerLocator
     * @param {string} notTaggedControllerResolverServiceId
     */
    __construct(resolverServiceId = 'argument_resolver.service', controllerTag = 'controller.service_arguments', controllerLocator = 'argument_resolver.controller_locator', notTaggedControllerResolverServiceId = 'argument_resolver.not_tagged_controller') {
        /**
         * @type {string}
         *
         * @private
         */
        this._resolverServiceId = resolverServiceId;

        /**
         * @type {string}
         *
         * @private
         */
        this._controllerTag = controllerTag;

        /**
         * @type {string}
         *
         * @private
         */
        this._controllerLocator = controllerLocator;

        /**
         * @type {string}
         *
         * @private
         */
        this._notTaggedControllerResolverServiceId = notTaggedControllerResolverServiceId;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        if (false === container.hasDefinition(this._resolverServiceId) && false === container.hasDefinition(this._notTaggedControllerResolverServiceId)) {
            return;
        }

        const parameterBag = container.parameterBag;
        const controllers = {};

        for (const [ id, tags ] of __jymfony.getEntries(container.findTaggedServiceIds(this._controllerTag, true))) {
            let def = container.getDefinition(id);
            def.setPublic(true);

            let class_ = def.getClass();

            // Resolve service class, taking parent definitions into account
            while (def instanceof ChildDefinition) {
                def = container.findDefinition(def.getParent());
                class_ = class_ || def.getClass();
            }

            class_ = parameterBag.resolveValue(class_);

            const r = container.getReflectionClass(class_);
            if (! r) {
                throw new InvalidArgumentException(__jymfony.sprintf('Class "%s" used for service "%s" cannot be found.', class_, id));
            }

            const isContainerAware = r.isSubclassOf(ContainerAwareInterface) || (
                ReflectionClass.exists('Jymfony.Bundle.FrameworkBundle.Controller.AbstractController') &&
                r.isSubclassOf('Jymfony.Bundle.FrameworkBundle.Controller.AbstractController')
            );

            // Get regular public methods
            const methods = {};
            const args = {};
            for (const methodName of r.methods) {
                const method = r.getMethod(methodName);
                if ('setContainer' === method.name && isContainerAware) {
                    continue;
                }

                if ('__construct' === method.name) {
                    continue;
                }

                methods[method.name.toLowerCase()] = [ method, method.parameters ];
            }

            // Validate and collect explicit per-actions and per-arguments service references
            let autowire = false;
            for (const attributes of Object.values(tags)) {
                if (undefined === attributes.action && undefined === attributes.argument && undefined === attributes.id) {
                    autowire = true;
                    continue;
                }

                for (const k of [ 'action', 'argument', 'id' ]) {
                    if (undefined === attributes[k] || undefined === attributes[k][0]) {
                        throw new InvalidArgumentException(__jymfony.sprintf('Missing "%s" attribute on tag "%s" %s for service "%s".', k, this._controllerTag, JSON.stringify(attributes), id));
                    }
                }

                const action = String(attributes.action).toLowerCase();
                if (undefined === methods[action]) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Invalid "action" attribute on tag "%s" for service "%s": no public "%s()" method found on class "%s".', this._controllerTag, id, attributes.action, class_));
                }

                const [ r, parameters ] = methods[action];
                let found = false;

                for (const p of parameters) {
                    if (attributes.argument === p.name) {
                        if (undefined === args[r.name]) {
                            args[r.name] = {};
                        }

                        if (undefined === args[r.name][p.name]) {
                            args[r.name][p.name] = attributes.id;
                        }

                        found = true;
                        break;
                    }
                }

                if (! found) {
                    throw new InvalidArgumentException(__jymfony.sprintf('Invalid "%s" tag for service "%s": method "%s()" has no "%s" argument on class "%s".', this._controllerTag, id, r.name, attributes.argument, class_));
                }
            }

            for (const [ r, parameters ] of Object.values(methods)) {
                __assert(r instanceof ReflectionMethod);

                // Create a per-method map of argument-names to service/type-references
                const argsMap = {};
                for (const p of parameters) {
                    __assert(p instanceof ReflectionParameter);

                    const type = ReflectionHelper.getParameterType(p);
                    let invalidBehavior = Container.IGNORE_ON_INVALID_REFERENCE;

                    if (!! args[r.name] && !! args[r.name][p.name]) {
                        const target = args[r.name][p.name];
                        if ('' === target) {
                            throw new InvalidArgumentException(__jymfony.sprintf('A "%s" tag must have non-empty "id" attributes for service "%s".', this._controllerTag, id));
                        } else if (null === p.defaultValue) {
                            invalidBehavior = Container.NULL_ON_INVALID_REFERENCE;
                        }
                    } else if (! type || ! autowire || -1 !== [ 'boolean', 'number', 'string', 'object', 'undefined', 'symbol' ].indexOf(type)) {
                        continue;
                    }

                    if (type && ! ReflectionClass.exists(type)) {
                        if (p.defaultValue !== undefined) {
                            continue;
                        }

                        const message = __jymfony.sprintf('Cannot determine controller argument for "%s:%s()": the %s argument is type-hinted with the non-existent class or interface: "%s".', class_, r.name, p.name, type);

                        throw new InvalidArgumentException(message);
                    }

                    argsMap[p.name] = new Reference(type, invalidBehavior);
                }

                // Register the maps as a per-method service-locators
                if (0 < Object.keys(argsMap).length) {
                    controllers[id + ':' + r.name] = ServiceLocatorTagPass.register(container, argsMap);
                }
            }
        }

        const controllerLocatorRef = ServiceLocatorTagPass.register(container, controllers);

        if (container.hasDefinition(this._resolverServiceId)) {
            container.getDefinition(this._resolverServiceId)
                .replaceArgument(0, controllerLocatorRef);
        }

        if (container.hasDefinition(this._notTaggedControllerResolverServiceId)) {
            container.getDefinition(this._notTaggedControllerResolverServiceId)
                .replaceArgument(0, controllerLocatorRef);
        }

        container.setAlias(this._controllerLocator, String(controllerLocatorRef));
    }
}
