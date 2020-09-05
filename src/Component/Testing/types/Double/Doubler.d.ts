declare namespace Jymfony.Component.Testing.Double {
    import ObjectProphecy = Jymfony.Component.Testing.Prophecy.ObjectProphecy;

    export class Doubler {
        private _superClass?: Newable;
        private _interfaces: Newable[];
        private _instance: any;
        private _constructorArgs?: any[];
        private _prophecy: ObjectProphecy;

        /**
         * Constructor.
         */
        __construct(prophecy: ObjectProphecy): void;
        constructor(prophecy: ObjectProphecy);

        /**
         * Adds an interface to be implemented by the double.
         */
        addInterface(interface_: Newable): this;

        /**
         * Sets the class to be extended by the double.
         */
        public /* writeonly */ superClass: Newable;

        /**
         * Sets the constructor arguments.
         */
        public /* writeonly */ constructorArguments: any[];

        /**
         * Gets the instance.
         */
        getInstance(): any;

        /**
         * Creates the double.
         *
         * @private
         */
        private _double(): any;
    }
}
