const AddSecurityVotersPass = Jymfony.Bundle.SecurityBundle.DependencyInjection.Compiler.AddSecurityVotersPass;
const Bundle = Jymfony.Component.Kernel.Bundle;

/**
 * Bundle
 *
 * @memberOf Jymfony.Bundle.SecurityBundle
 */
class SecurityBundle extends Bundle {
    /**
     * @inheritdoc
     */
    build(container) {
        container
            .addCompilerPass(new AddSecurityVotersPass())
        ;
    }
}

module.exports = SecurityBundle;
