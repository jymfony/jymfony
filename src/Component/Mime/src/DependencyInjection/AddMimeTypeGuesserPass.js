const CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * Registers custom mime types guessers.
 *
 * @memberOf Jymfony.Component.Mime.DependencyInjection
 */
class AddMimeTypeGuesserPass extends implementationOf(CompilerPassInterface) {
    /**
     * @inheritdoc
     */
    process(container) {
        if (! container.has('mime_types')) {
            return;
        }

        const definition = container.findDefinition('mime_types');
        for (const id of Object.keys(container.findTaggedServiceIds('mime.mime_type_guesser'))) {
            definition.addMethodCall('registerGuesser', [ new Reference(id) ]);
        }
    }
}

module.exports = AddMimeTypeGuesserPass;
