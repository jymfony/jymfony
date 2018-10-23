const IteratorArgument = Jymfony.Component.DependencyInjection.Argument.IteratorArgument;
const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;
const VoterInterface = Jymfony.Component.Security.Authorization.Voter.VoterInterface;
const AccessDecisionManager = Jymfony.Component.Security.Authorization.AccessDecisionManager;

/**
 * @memberOf Jymfony.SecurityBundle.DependencyInjection.Compiler
 */
class AddSecurityVotersPass extends implementationOf(CompilerPassInterface, PriorityTaggedServiceTrait) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition(AccessDecisionManager)) {
            return;
        }

        const voters = Array.from(this.findAndSortTaggedServices('security.voter', container));
        if (0 === voters.length) {
            return;
        }

        for (const voter of voters) {
            const definition = container.getDefinition(voter.toString());
            const reflClass = new ReflectionClass(container.parameterBag.resolveValue(definition.getClass(), true));

            if (! reflClass.isSubclassOf(VoterInterface)) {
                throw new LogicException(__jymfony.sprintf('%s must implement the %s when used as a voter.', reflClass.name, ReflectionClass.getClassName(VoterInterface)));
            }
        }

        container.getDefinition(AccessDecisionManager).replaceArgument(0, new IteratorArgument(voters));
    }
}

module.exports = AddSecurityVotersPass;
