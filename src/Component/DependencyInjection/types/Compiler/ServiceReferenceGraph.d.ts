declare namespace Jymfony.Component.DependencyInjection.Compiler {
    /**
     * Graph representation of services.
     *
     * Use this in compiler passes instead of collecting these info
     * in every pass.
     *
     * @internal
     */
    export class ServiceReferenceGraph {
        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Checks whether the given id is present on the current graph.
         */
        hasNode(id: string): boolean;

        /**
         * Gets a node.
         *
         * @throws InvalidArgumentException
         */
        getNode(id: string): ServiceReferenceGraphNode;

        /**
         * Gets all the nodes.
         */
        getNodes(): Record<string, ServiceReferenceGraphNode>;

        /**
         * Clears the graph.
         */
        clear(): void;

        /**
         * Creates and connects two nodes.
         */
        connect(sourceId: string, sourceValue: any, destinationId: string, destinationValue?: any, reference?: any): void;

        private _createNode(id: string, value: any): ServiceReferenceGraphNode;
    }
}
