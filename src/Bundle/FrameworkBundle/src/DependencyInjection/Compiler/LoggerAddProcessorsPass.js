const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Bundle.FrameworkBundle.DependencyInjection.Compiler
 */
export default class LoggerAddProcessorsPass extends implementationOf(CompilerPassInterface) {

    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.hasDefinition('jymfony.logger')) {
            return;
        }

        for (const [ id, tags ] of __jymfony.getEntries(container.findTaggedServiceIds('logger.processor'))) {
            for (const tag of tags) {
                if (tag.channel && tag.handler) {
                    throw new InvalidArgumentException(__jymfony.sprintf('You cannot specify both the "handler" and "channel" attributes for the "logger.processor" tag on service %s', id));
                }

                let definition;
                if (tag.handler) {
                    definition = container.findDefinition('jymfony.logger.handler.' + tag.handler);
                } else if (tag.channel) {
                    definition = container.findDefinition('jymfony.logger' + ('app' === tag.channel ? '' : '.' + tag.channel));
                } else {
                    definition = container.findDefinition('jymfony.logger');
                }

                definition.addMethodCall('pushProcessor', [ new Reference(id) ]);
            }
        }
    }
}
