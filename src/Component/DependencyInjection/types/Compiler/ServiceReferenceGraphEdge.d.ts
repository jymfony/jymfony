declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class ServiceReferenceGraphEdge {
        private _sourceNode: ServiceReferenceGraphNode;
        private _destinationNode: ServiceReferenceGraphNode;
        private _value: any;

        /**
         * Constructor.
         */
        __construct(sourceNode: ServiceReferenceGraphNode, destinationNode: ServiceReferenceGraphNode, value?: any): void;
        constructor(sourceNode: ServiceReferenceGraphNode, destinationNode: ServiceReferenceGraphNode, value?: any);

        getSourceNode(): ServiceReferenceGraphNode;
        getDestinationNode(): ServiceReferenceGraphNode;
        getValue(): any;
    }
}
