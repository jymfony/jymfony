declare namespace Jymfony.Bundle.SecurityBundle {
    import Bundle = Jymfony.Component.Kernel.Bundle;
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    /**
     * Bundle
     */
    export class SecurityBundle extends Bundle {
        /**
         * @inheritdoc
         */
        build(container: ContainerBuilder): void;
    }
}
