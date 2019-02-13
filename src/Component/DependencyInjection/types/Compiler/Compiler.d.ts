declare namespace Jymfony.Component.DependencyInjection.Compiler {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;

    export class Compiler {
        private _passConfig: PassConfig;
        private _referenceGraph: ServiceReferenceGraph;
        private _logFormatter: LogFormatter;
        private _logs: string[];

        /**
         * Get the compiler log formatter
         */
        readonly logFormatter: LogFormatter;

        /**
         * Compile container processing all compiler passes.
         */
        compile(container: ContainerBuilder): void;

        /**
         * Add a compilation pass.
         */
        addPass(pass: CompilerPassInterface, type: string, priority: number);

        /**
         * Adds log message to log queue
         */
        addLogMessage(message: string): void;

        /**
         * @final
         */
        log(pass: CompilerPassInterface, message: string): void;

        getServiceReferenceGraph(): ServiceReferenceGraph;

        /**
         * Get log messages.
         */
        getLogs(): string[];
    }
}
