declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class ServiceReferenceGraphEdge {
        private _sourceNode: ServiceReferenceGraphNode;
        private _destinationNode: ServiceReferenceGraphNode;
        private _value: any;
        private _lazy: boolean;
        private _weak: boolean;

        /**
         * Constructor.
         */
        __construct(sourceNode: ServiceReferenceGraphNode, destinationNode: ServiceReferenceGraphNode, value?: any, lazy?: boolean, weak?: boolean): void;
        constructor(sourceNode: ServiceReferenceGraphNode, destinationNode: ServiceReferenceGraphNode, value?: any, lazy?: boolean, weak?: boolean);

        getSourceNode(): ServiceReferenceGraphNode;
        getDestinationNode(): ServiceReferenceGraphNode;
        getValue(): any;
        isLazy(): boolean;
        isWeak(): boolean;
    }
}
