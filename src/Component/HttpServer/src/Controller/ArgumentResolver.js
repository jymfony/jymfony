const ArgumentResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentResolverInterface;
const DefaultValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.DefaultValueResolver;
const RequestAttributeValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestAttributeValueResolver;
const RequestValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestValueResolver;
const SessionValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.SessionValueResolver;
const VariadicValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.VariadicValueResolver;

/**
 * Responsible for resolving the arguments passed to an action.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller
 */
export default class ArgumentResolver extends implementationOf(ArgumentResolverInterface) {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface[]} [argumentValueResolvers = []]
     */
    __construct(argumentValueResolvers = []) {
        argumentValueResolvers = [ ...argumentValueResolvers ];

        /**
         * @type {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface[]}
         *
         * @private
         */
        this._argumentValueResolvers = 0 < argumentValueResolvers.length ? argumentValueResolvers : __self.getDefaultArgumentValueResolvers();
    }

    /**
     * @inheritdoc
     */
    async getArguments(request, controller) {
        const args = [];
        const reflectionMethod = this._getReflectionMethod(controller);
        if (null === reflectionMethod) {
            return [ request ];
        }

        controller_argument: for (const parameter of reflectionMethod.parameters) {
            for (const resolver of this._argumentValueResolvers) {
                if (! resolver.supports(request, parameter)) {
                    continue;
                }

                let atLeastOne = false;
                await __jymfony.forAwait(resolver.resolve(request, parameter), append => {
                    atLeastOne = true;
                    args.push(append);
                });

                if (! atLeastOne) {
                    throw new InvalidArgumentException(__jymfony.sprintf('%s.resolve() must yield at least one value.', ReflectionClass.getClassName(resolver)));
                }

                // Continue to the next controller argument
                continue controller_argument;
            }

            const representative = reflectionMethod.reflectionClass.name +
                ('__invoke' !== reflectionMethod.name ? ':' + reflectionMethod.name + '()' : '');

            throw new RuntimeException(__jymfony.sprintf('Controller "%s" requires that you provide a value for the "%s" argument. Either the argument is nullable and no null value has been provided, no default value has been provided or because there is a non optional argument after this one.', representative, parameter.name));
        }

        return args;
    }

    /**
     * Gets the default argument value resolvers.
     *
     * @returns {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface[]}
     */
    static getDefaultArgumentValueResolvers() {
        return [
            new RequestAttributeValueResolver(),
            new RequestValueResolver(),
            new SessionValueResolver(),
            new DefaultValueResolver(),
            new VariadicValueResolver(),
        ];
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
        } catch (e) {
            // Do nothing.
        }

        if (!! innerObject) {
            controller = [ innerObject.getObject(), innerObject._func.name ];
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
