const ArgumentResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentResolverInterface;
const DefaultValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.DefaultValueResolver;
const RequestAttributeValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestAttributeValueResolver;
const RequestValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.RequestValueResolver;
const SessionValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.SessionValueResolver;
const VariadicValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.VariadicValueResolver;
const ArgumentMetadataFactory = Jymfony.Component.HttpServer.Controller.Metadata.ArgumentMetadataFactory;

/**
 * Responsible for resolving the arguments passed to an action.
 *
 * @final
 * @memberOf Jymfony.Component.HttpServer.Controller
 */
export default class ArgumentResolver extends implementationOf(ArgumentResolverInterface) {
    /**
     * @type {Jymfony.Contracts.Metadata.MetadataFactoryInterface<Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata>}
     *
     * @private
     */
    _argumentMetadataFactory;

    /**
     * @type {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface[]}
     *
     * @private
     */
    _argumentValueResolvers;

    /**
     * Constructor.
     *
     * @param {Jymfony.Contracts.Metadata.MetadataFactoryInterface<Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata>} argumentMetadataFactory
     * @param {Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface[]} [argumentValueResolvers = []]
     */
    __construct(argumentMetadataFactory = null, argumentValueResolvers = []) {
        this._argumentMetadataFactory = argumentMetadataFactory || new ArgumentMetadataFactory();

        argumentValueResolvers = [ ...argumentValueResolvers ];
        this._argumentValueResolvers = 0 < argumentValueResolvers.length ? argumentValueResolvers : __self.getDefaultArgumentValueResolvers();
    }

    /**
     * @inheritdoc
     */
    async getArguments(request, controller) {
        const args = [];
        const metadata = this._getMetadata(controller);
        if (null === metadata) {
            return [ request ];
        }

        controller_argument: for (const parameter of metadata.parameters) {
            for (const resolver of this._argumentValueResolvers) {
                if (! await resolver.supports(request, parameter)) {
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

            const reflectionMethod = parameter.reflection;
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
     * Gets the ControllerMetadata object from the controller.
     *
     * @param {Function} controller
     *
     * @returns {Jymfony.Component.HttpServer.Controller.Metadata.ControllerMetadata}
     *
     * @private
     */
    _getMetadata(controller) {
        if (! this._argumentMetadataFactory.hasMetadataFor(controller)) {
            return null;
        }

        return this._argumentMetadataFactory.getMetadataFor(controller);
    }
}
