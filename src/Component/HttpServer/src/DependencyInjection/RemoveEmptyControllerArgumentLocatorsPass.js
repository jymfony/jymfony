const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

/**
 * Removes empty service-locators registered for ServiceValueResolver.
 *
 * @memberOf Jymfony.Component.HttpServer.DependencyInjection
 */
export default class RemoveEmptyControllerArgumentLocatorsPass extends implementationOf(CompilerPassInterface) {
    /**
     * Constructor.
     *
     * @param {string} controllerLocator
     */
    __construct(controllerLocator = 'argument_resolver.controller_locator') {
        /**
         * @type {string}
         *
         * @private
         */
        this._controllerLocator = controllerLocator;
    }

    /**
     * @inheritdoc
     */
    process(container) {
        if (false === container.hasDefinition(this._controllerLocator) && false === container.hasAlias(this._controllerLocator)) {
            return;
        }

        const controllerLocator = container.findDefinition(this._controllerLocator);
        const controllers = controllerLocator.getArgument(0);

        for (const [ controller, argumentRef ] of __jymfony.getEntries(controllers)) {
            let reason;
            const argumentLocator = container.getDefinition(argumentRef.values[0].toString());

            if (0 === Object.keys(argumentLocator.getArgument(0)).length) {
                // Remove empty argument locators
                reason = __jymfony.sprintf('Removing service-argument resolver for controller "%s": no corresponding services exist for the referenced types.', controller);
            } else {
                // Any methods listed for call-at-instantiation cannot be actions
                reason = false;
                const [ id, action ] = controller.split(':');
                const controllerDef = container.getDefinition(id);
                for (const [ method ] of [ ...controllerDef.getMethodCalls(), ...controllerDef.getShutdownCalls() ]) {
                    if (action.toLowerCase() === method.toLowerCase()) {
                        reason = __jymfony.sprintf('Removing method "%s" of service "%s" from controller candidates: the method is called by dependency injection, thus cannot be an action.', action, id);
                        break;
                    }
                }

                if (! reason) {
                    if ('__invoke' === action) {
                        controllers[id] = argumentRef;
                    }

                    continue;
                }
            }

            delete controllers[controller];
            container.log(this, reason);
        }

        controllerLocator.replaceArgument(0, controllers);
    }
}
