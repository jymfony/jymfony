declare namespace Jymfony.Component.Mime.DependencyInjection {
    import ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
    import CompilerPassInterface = Jymfony.Component.DependencyInjection.Compiler.CompilerPassInterface;

    /**
     * Registers custom mime types guessers.
     */
    export class AddMimeTypeGuesserPass extends implementationOf(CompilerPassInterface) {
        /**
         * @inheritdoc
         */
        process(container: ContainerInterface): void;
    }
}
