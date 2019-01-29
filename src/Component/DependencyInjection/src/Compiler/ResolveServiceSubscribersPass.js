const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * Compiler pass to inject their service locator to service subscribers.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class ResolveServiceSubscribersPass extends AbstractRecursivePass {
    __construct() {
        super.__construct();

        this._serviceLocator = undefined;
    }

    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof Reference && this._serviceLocator && ReflectionClass.getClassName(ContainerInterface) === value.toString()) {
            return new Reference(this._serviceLocator);
        }

        if (! (value instanceof Definition)) {
            return super._processValue(value, isRoot);
        }

        const serviceLocator = this._serviceLocator;
        this._serviceLocator = undefined;

        if (value.hasTag('container.service_subscriber.locator')) {
            this._serviceLocator = value.getTag('container.service_subscriber.locator')[0].id;
            value.clearTag('container.service_subscriber.locator');
        }

        try {
            return super._processValue(value);
        } finally {
            this._serviceLocator = serviceLocator;
        }
    }
}

module.exports = ResolveServiceSubscribersPass;
