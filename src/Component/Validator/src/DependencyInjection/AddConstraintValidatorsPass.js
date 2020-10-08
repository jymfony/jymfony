const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;
const ServiceLocatorTagPass = Jymfony.Component.DependencyInjection.Compiler.ServiceLocatorTagPass;

/**
 * @memberOf Jymfony.Component.Validator.DependencyInjection
 */
export default class AddConstraintValidatorsPass extends implementationOf(CompilerPassInterface) {
    /**
     * Constructor.
     *
     * @param {string} validatorFactoryServiceId
     * @param {string} constraintValidatorTag
     */
    __construct(validatorFactoryServiceId = 'validator.validator_factory', constraintValidatorTag = 'validator.constraint_validator') {
        this._validatorFactoryServiceId = validatorFactoryServiceId;
        this._constraintValidatorTag = constraintValidatorTag;
    }

    process(container) {
        if (! container.hasDefinition(this._validatorFactoryServiceId)) {
            return;
        }

        const validators = {};
        for (const [ id, attributes ] of container.findTaggedServiceIds(this._constraintValidatorTag)) {
            const definition = container.getDefinition(id);

            if (undefined !== attributes[0].alias) {
                validators[attributes[0].alias] = new Reference(id);
            }

            validators[definition.getClass()] = new Reference(id);
        }

        container
            .getDefinition(this._validatorFactoryServiceId)
            .replaceArgument(0, ServiceLocatorTagPass.register(container, validators))
        ;
    }
}
