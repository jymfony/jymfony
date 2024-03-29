/// <reference types="node" />

declare class ReflectorInterface {
    public static readonly definition: Newable<ReflectorInterface>;

    /**
     * Gets the class metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];
}

declare class ReflectionClass<T extends object = any> extends implementationOf(ReflectorInterface) {
    private _isInterface: boolean;
    private _methods: any;
    private _staticMethods: any;
    private _readableProperties: any;
    private _writableProperties: any;
    private _properties: any;
    private _constants: any;
    private _fields: any;
    private _staticFields: any;
    private _interfaces: any[];
    private _docblock: any;

    /**
     * Constructor.
     */
    constructor(value: string | T | Newable<T>);

    /**
     * Checks if a class exists.
     */
    static exists(className: string): boolean;

    /**
     * Gets a class constructor given an object or a string
     * containing a FQCN.
     */
    static getClass<T extends object = any, S extends object = object>(className: string): Newable<T, S>;
    static getClass<T extends object = any, S extends object = object>(className: T | Newable<T, S>): Newable<T, S>;

    /**
     * Gets a FQCN from an object, constructor or a string.
     */
    static getClassName(className: string | object): string;

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
    hasMethod(name: string | symbol): boolean;

    /**
     * Gets the reflection method instance for a given method name.
     */
    getMethod(name: string | symbol): ReflectionMethod<T>;

    /**
     * Checks if class has defined property (getter/setter).
     */
    hasProperty(name: string | symbol): boolean;

    /**
     * Checks if class has readable property (getter).
     */
    hasReadableProperty(name: string | symbol): boolean;

    /**
     * Gets the readable property (getter) reflection object.
     */
    getReadableProperty(name: string | symbol): ReflectionProperty<T>;

    /**
     * Checks if class has writable property (setter).
     */
    hasWritableProperty(name: string | symbol): boolean;

    /**
     * Gets the writable property (setter) reflection object.
     */
    getWritableProperty(name: string | symbol): ReflectionProperty<T>;

    /**
     * Checks if class has defined the given class field.
     */
    hasField(name: string): boolean;

    /**
     * Gets the reflection field instance for a given field name.
     */
    getField(name: string): ReflectionField<T>;

    /**
     * Gets the property descriptor.
     */
    getPropertyDescriptor(name: string | symbol): PropertyDescriptor;

    /**
     * Returns the ReflectionClass object for the parent class.
     */
    getParentClass(): ReflectionClass | undefined;

    /**
     * Gets the class constructor.
     */
    getConstructor(): Newable<T>;

    /**
     * Checks whether this class is a subclass of a given subclass.
     */
    isSubclassOf(superClass: string | Newable): boolean;

    /**
     * Checks whether this class is an instance of the given class.
     */
    isInstanceOf(superClass: string | Newable): boolean;

    /**
     * Is this class an interface?
     */
    readonly isInterface: boolean;

    /**
     * Is this class a trait?
     */
    readonly isTrait: boolean;

    /**
     * Get the fully qualified name of the reflected class.
     */
    readonly name?: string;

    /**
     * Get the Namespace object containing this class.
     */
    readonly namespace: null | Jymfony.Component.Autoloader.Namespace;

    /**
     * Get the namespace name.
     */
    readonly namespaceName: null | string;

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
    readonly methods: (string | symbol)[];

    /**
     * Gets the docblock for this class.
     */
    readonly docblock: string;

    /**
     * Gets the fields names.
     */
    readonly fields: string[];

    /**
     * Get properties name defined by setters/getters.
     * Other properties are added dynamically and are not
     * enumerable in the prototype.
     */
    readonly properties: (string | symbol)[];

    /**
     * Get constants.
     */
    readonly constants: Record<string, any>;

    /**
     * Get interfaces reflection classes.
     */
    readonly interfaces: ReflectionClass[];

    /**
     * Get traits reflection classes.
     */
    readonly traits: ReflectionClass[];

    /**
     * Gets the class metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];

    /**
     * Gets the constructor method (reflection).
     */
    readonly constructorMethod: ReflectionMethod | null;
}

/**
 * Reflection utility for class method.
 */
declare class ReflectionMethod<Class extends object = any> extends implementationOf(ReflectorInterface) {
    static readonly FUNCTION = 'function';
    static readonly ASYNC_FUNCTION = 'async function';
    static readonly GENERATOR = 'generator';

    /**
     * Constructor.
     */
    constructor(reflectionClass: ReflectionClass<Class>, methodName: string);

    /**
     * Invokes the method.
     */
    invoke(object: any, ...args: any[]): any;

    /**
     * Gets the reflection class.
     */
    readonly reflectionClass: ReflectionClass<Class>;

    /**
     * Gets the method name.
     */
    readonly name: string;

    /**
     * Whether this method is private.
     */
    readonly isPrivate: boolean;

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


    /**
     * Gets the class metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];

    /**
     * Gets the parameters' reflection objects.
     */
    readonly parameters: ReflectionParameter<Class>[];

    /**
     * Gets the reflected method.
     */
    readonly method: Invokable;
}

declare class ReflectionParameter<Class extends object = any> extends implementationOf(ReflectorInterface) {
    private constructor(reflectionMethod: ReflectionMethod,
                        name: string,
                        index: number,
                        hasDefaultValue?: boolean,
                        scalarDefaultValue?: any,
                        objectPattern?: boolean,
                        arrayPattern?: boolean,
                        restElement?: boolean);

    /**
     * Gets the reflection class.
     */
    readonly reflectionClass: ReflectionClass<Class>;

    /**
     * Gets the reflection method.
     */
    readonly reflectionMethod: ReflectionMethod<Class>;

    /**
     * Gets the parameter name.
     */
    readonly name: string;

    /**
     * Whether the parameter has default value (does not imply that scalarDefaultValue is defined).
     */
    readonly hasDefaultValue: any;

    /**
     * Gets the parameter default value (if scalar).
     */
    readonly scalarDefaultValue: any;

    /**
     * Whether this parameter is an object pattern.
     */
    readonly isObjectPattern: boolean;

    /**
     * Whether this parameter is an array pattern.
     */
    readonly isArrayPattern: boolean;

    /**
     * Whether this parameter is a rest element.
     */
    readonly isRestElement: boolean;

    /**
     * Gets the parameter metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];
}

/**
 * Reflection utility for class field.
 */
declare class ReflectionField<Class extends object = any> extends implementationOf(ReflectorInterface) {
    /**
     * Constructor.
     */
    constructor(reflectionClass: ReflectionClass<Class>, methodName: string);

    /**
     * Gets the reflection class.
     */
    readonly reflectionClass: ReflectionClass<Class>;

    /**
     * Gets the field name.
     */
    readonly name: string;

    /**
     * If this field is private.
     */
    readonly isPrivate: boolean;

    /**
     * Gets if this field is static.
     */
    readonly isStatic: boolean;

    /**
     * Docblock.
     */
    readonly docblock: string;

    /**
     * Sets the accessible flag.
     * Must be set to true to use the field accessors.
     */
    /* writeonly */ accessible: boolean;

    /**
     * Gets the class metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];

    /**
     * Gets the field current value.
     */
    getValue(object: any): any;

    /**
     * Sets the field current value.
     */
    setValue(object: any, value: any): any;

    /**
     * Checks if the field is accessible by accessors.
     */
    private _checkAccessible(): void;
}

/**
 * Reflection utility for class method.
 */
declare class ReflectionProperty<Class extends object = any> extends implementationOf(ReflectorInterface) {
    public static readonly KIND_GET = 'get';
    public static readonly KIND_SET = 'set';

    private _class: ReflectionClass<Class>;
    private _name: string;
    private _method: Invokable;
    private _docblock: string;

    /**
     * Constructor.
     *
     * @param {ReflectionClass} reflectionClass
     * @param {string} kind
     * @param {string} propertyName
     */
    constructor(reflectionClass: ReflectionClass<Class>, kind: 'get' | 'set', propertyName: string);

    /**
     * Invokes the getter/setter method.
     */
    invoke(object: any, ...args: any[]): any;

    /**
     * Gets the reflection class.
     */
    readonly reflectionClass: ReflectionClass<Class>;

    /**
     * Gets the method name.
     *
     * @returns {string}
     */
    readonly name: string;

    /**
     * Docblock.
     *
     * @returns {string}
     */
    readonly docblock: string;

    /**
     * Gets the class metadata.
     */
    readonly metadata: [Newable, any][];

    /**
     * Gets the annotation instances of the given class.
     */
    getAnnotations<T extends object>(class_: Newable<T>, subclass?: boolean): T[];
    getAnnotations(class_: string, subclass?: boolean): object[];
    getAnnotations(class_: Newable | string, subclass?: boolean): object[];
}

declare class ReflectionException extends Error {}
declare function __assert(condition: any, msg?: string): asserts condition;

declare interface SymbolConstructor {
    docblock: symbol;
    reflection: symbol;
}

declare module NodeJS {
    interface Global {
        ReflectionClass: Newable<ReflectionClass, typeof ReflectionClass>;
        ReflectionException: Newable<ReflectionException>;
        ReflectionField: Newable<ReflectionField, typeof ReflectionField>;
        ReflectionMethod: Newable<ReflectionMethod, typeof ReflectionMethod>;
        ReflectionProperty: Newable<ReflectionProperty, typeof ReflectionProperty>;
        ReflectionParameter: Newable<ReflectionParameter, typeof ReflectionParameter>;
        __assert: (condition: any, msg?: string) => asserts condition;
    }
}
