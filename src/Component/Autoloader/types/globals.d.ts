/// <reference types="node" />

declare class ReflectionClass<T = any> {
    /**
     * Constructor.
     */
    constructor(value: string|Object|Newable<T>);

    /**
     * Checks if a class exists.
     */
    static exists(className: string): boolean;

    /**
     * Gets a class constructor given an object or a string
     * containing a FQCN.
     */
    static getClass<T = any>(className: string|Object): Newable<T>;

    /**
     * Gets a FQCN from an object, constructor or a string.
     */
    static getClassName(className: string|Object): string;

    /**
     * Construct a new object.
     */
    newInstance(...varArgs: any[]): T;

    /**
     * Construct a new object without calling its constructor.
     */
    newInstanceWithoutConstructor(): any;

    /**
     * Checks if this class contains a method.
     */
    hasMethod(name: string|symbol): boolean;

    /**
     * Gets the reflection method instance for a given method name.
     */
    getMethod(name: string|symbol): ReflectionMethod;

    /**
     * Checks if class has defined property (getter/setter).
     */
    hasProperty(name: string|symbol): boolean;

    /**
     * Checks if class has readable property (getter).
     */
    hasReadableProperty(name: string|symbol): boolean;

    /**
     * Checks if class has writable property (setter).
     */
    hasWritableProperty(name: string|symbol): boolean;

    /**
     * Gets the property descriptor.
     */
    getPropertyDescriptor(name: string|symbol): PropertyDescriptor;

    /**
     * Returns the ReflectionClass object for the parent class.
     */
    getParentClass(): ReflectionClass|undefined;

    /**
     * Gets the class constructor.
     */
    getConstructor(): Newable<T>;

    /**
     * Checks whether this class is a subclass of a given subclass.
     */
    isSubclassOf(superClass: string|Newable<any>): boolean;

    /**
     * Checks whether this class is an instance of the given class.
     */
    isInstanceOf(superClass: string|Newable<any>): boolean;

    /**
     * Is this class an interface?
     */
    readonly isInterface: boolean;

    /**
     * Get the fully qualified name of the reflected class.
     */
    readonly name?: string;

    /**
     * Get the Namespace object containing this class.
     */
    readonly namespace: Jymfony.Component.Autoloader.Namespace;

    /**
     * Get the namespace name.
     */
    readonly namespaceName: string;

    /**
     * Filename declaring this class.
     */
    readonly filename: string;

    /**
     * Module object exporting this class.
     */
    readonly module?: NodeModule;

    /**
     * Get all methods names.
     */
    readonly methods: (string|symbol)[];

    /**
     * Gets the docblock for this class.
     */
    readonly docblock: string;

    /**
     * Get properties name defined by setters/getters.
     * Other properties are added dynamically and are not
     * enumerable in the prototype.
     */
    readonly properties: (string|symbol)[];

    /**
     * Get constants.
     */
    readonly constants: Record<string, any>;

    /**
     * Get interfaces reflection classes.
     */
    readonly interfaces: ReflectionClass[];
}

/**
 * Reflection utility for class method.
 */
declare class ReflectionMethod {
    static readonly FUNCTION = 'function';
    static readonly ASYNC_FUNCTION = 'async function';
    static readonly GENERATOR = 'generator';

    /**
     * Constructor.
     */
    constructor(reflectionClass: ReflectionClass, methodName: string);

    /**
     * Gets the reflection class.
     */
    readonly reflectionClass: ReflectionClass;

    /**
     * Gets the method name.
     */
    readonly name: string;

    /**
     * Gets if this method is static.
     */
    readonly isStatic: boolean;

    /**
     * Gets if the function is a generator.
     */
    readonly isGenerator: boolean;

    /**
     * Is this function async?
     */
    readonly isAsync: boolean;

    /**
     * Docblock.
     */
    readonly docblock: string;
}

declare class ReflectionException extends Error {}

declare interface SymbolConstructor {
    docblock: symbol;
    reflection: symbol;
}

declare module NodeJS {
    interface Global {
        ReflectionClass: Newable<ReflectionClass<any>>;
    }
}
