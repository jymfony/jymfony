declare namespace Jymfony.Component.DependencyInjection.Dumper {
    import ContainerBuilder = Jymfony.Component.DependencyInjection.ContainerBuilder;
    import Variable = Jymfony.Component.DependencyInjection.Variable;

    interface DumpOptions {
        class_name?: string;
        base_class?: string;
        build_time?: number;
    }

    /**
     * Dumps container in a js class.
     */
    export class JsDumper {
        private _container: ContainerBuilder;
        private _inlinedDefinitions: Map<Definition, Definition[]>;
        private _serviceIdToMethodNameMap: Map<string, string>;
        private _usedMethodNames: Set<string>;
        private _definitionVariables: Map<Definition, Variable>;
        private _referenceVariables: Record<string, string | Variable>;
        private _variableCount: number;
        private _targetDirMaxMatches: number;
        private _targetDirRegex: RegExp;

        /**
         * Constructor.
         */
        __construct(container: ContainerBuilder): void;
        constructor(container: ContainerBuilder);

        /**
         * Dumps the service container.
         *
         * Available options:
         *  * class_name: The class name [default: ProjectContainer]
         *  * base_class: The base class name [default: Jymfony.Component.DependencyInjection.Container]
         *  * build_time: The build unix time.
         */
        dump(options?: DumpOptions): Record<string, string>;

        private _initMethodNamesMap(baseClass: string): void;

        private _startClass(className: string, baseClass: string): string;

        private _endClass(className: string): string;

        private _getMethodMap(): string;

        private _getAliases(): string;

        private _export(value: any): string;

        private _doExport(value: any): string;

        private _generateMethodName(id: string): string;

        private _getServices(): string;

        private _getDefaultParametersMethod(): string;

        /**
         * Generate a service.
         */
        private _getService(id: string, definition: Definition): string;

        private _addLocalTempVariables(cId: string, definition: Definition): string;

        private _addInlinedDefinitions(id: string, definition: Definition): string;

        /**
         * Generate service instance
         */
        private _addServiceInstance(id: string, definition: Definition): string;

        private _addInlinedDefinitionsSetup(id: string, definition: Definition): string;

        private _addProperties(definition: Definition, variableName?: string|Variable): string;

        private _addMethodCalls(definition: Definition, variableName?: string|Variable): string;

        private _addShutdownCalls(definition: Definition, variableName?: string|Variable): string;

        private _addConfigurator(definition: Definition, variableName?: string|Variable): string;

        private _addReturn(id: string, definition: Definition): string;

        /**
         * @throws {Jymfony.Component.DependencyInjection.Exception.RuntimeException}
         */
        private _dumpValue(value: any, interpolate?: boolean): string;

        private _getInlinedDefinitions(definition: Definition): Definition[];

        private _getDefinitionsFromArguments(args: any): IterableIterator<Definition>;

        /**
         * Dumps a parameter.
         */
        private _dumpParameter(name: string, resolveEnv?: boolean): string;

        private _getServiceCall(id: string, reference?: Reference): string;

        private _dumpLiteralClass(class_: string): string;

        private _getServiceCallsFromArguments(args: any, calls: any, behavior: any): void;

        private _isSimpleInstance(id: string, definition: Definition): boolean;

        private _addNewInstance(definition: Definition, ret: string, instantiation: string): string;

        private _getNextVariableName(): string;

        private _hasReference(id: string, args: any, deep?: boolean, visited?: Set<any>): boolean;

        private _getServiceConditionals(value: any): string;

        private _wrapServiceConditionals(value: any, code: string): string;
    }
}
