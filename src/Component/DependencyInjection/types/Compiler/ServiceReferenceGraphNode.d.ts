declare namespace Jymfony.Component.DependencyInjection.Compiler {
    export class ServiceReferenceGraphNode {
        private _id: string;
        private _value: any;
        private _inEdges: ServiceReferenceGraphEdge[];
        private _outEdges: ServiceReferenceGraphEdge[];

        /**
         * Constructor.
         */
        __construct(id: string, value: any): void;
        constructor(id: string, value: any);

        addInEdge(edge: ServiceReferenceGraphEdge): void;
        addOutEdge(edge: ServiceReferenceGraphEdge): void;
        isAlias(): boolean;
        isDefinition(): boolean;
        getId(): string;
        getInEdges(): ServiceReferenceGraphEdge[];
        getOutEdges(): ServiceReferenceGraphEdge[];
        getValue(): any;
    }
}
