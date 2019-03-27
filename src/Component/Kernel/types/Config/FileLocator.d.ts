declare namespace Jymfony.Component.Kernel.Config {
    import BaseLocator = Jymfony.Component.Config.FileLocator;
    import KernelInterface = Jymfony.Component.Kernel.KernelInterface;

    /**
     * FileLocator uses the KernelInterface to locate resources in bundles.
     */
    export class FileLocator extends BaseLocator {
        private _kernel: KernelInterface;
        private _path: string;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(kernel: KernelInterface, path?: string, paths?: string[] | string): void;
        constructor(kernel: KernelInterface, path?: string, paths?: string[] | string);

        /**
         * @inheritdoc
         */
        locate(name: string, currentPath?: undefined|string, first?: boolean): string|string[];
    }
}
