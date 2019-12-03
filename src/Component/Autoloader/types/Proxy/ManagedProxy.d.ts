declare namespace Jymfony.Component.Autoloader.Proxy {
    interface ProxyTraps {
        get?: (target: object, propertyKey: PropertyKey) => any;
        set?: (target: object, propertyKey: PropertyKey, value: any) => boolean;
        has?: (target: object, propertyKey: PropertyKey) => boolean;
        deleteProperty?: (target: object, propertyKey: PropertyKey) => boolean;
        defineProperty?: (target: object, propertyKey: PropertyKey, attributes: PropertyDescriptor) => boolean;
        ownKeys?: (target: object) => PropertyKey[];
        apply?: (target: Function, thisArgument: any, argumentsList: ArrayLike<any>) => any;
        construct?: (target: Function, argumentsList: ArrayLike<any>, newTarget?: any) => any;
        getPrototypeOf?: (target: object) => object;
        setPrototypeOf?: (target: object, proto: any) => boolean;
        isExtensible?: (target: object) => boolean;
        preventExtensions?: (target: object) => boolean;
        getOwnPropertyDescriptor?: (target: object, propertyKey: PropertyKey) => PropertyDescriptor | undefined;
    }

    export class ManagedProxy {
        /**
         * Constructor.
         */
        constructor(target: any, initializer?: (proxy?: ManagedProxy) => void, traps?: ProxyTraps);

        /**
         * Sets the target (during initialization).
         */
        public /* writeonly */ target: any;

        /**
         * Sets the initializer.
         */
        public /* writeonly */ initializer: Invokable;
    }
}

declare module __jymfony {
    const ManagedProxy: Jymfony.Component.Autoloader.Proxy.ManagedProxy;
}
