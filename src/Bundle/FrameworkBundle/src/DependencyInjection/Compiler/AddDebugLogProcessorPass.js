const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler
 */
export default class AddDebugLogProcessorPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        if (! container.hasDefinition('jymfony.logger_prototype')) {
            return;
        }

        if (! container.hasDefinition('debug.log_processor')) {
            return;
        }

        const definition = container.getDefinition('jymfony.logger_prototype');
        definition.addMethodCall('pushProcessor', [ new Reference('debug.log_processor') ]);
    }
}
