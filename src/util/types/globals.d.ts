/// <reference lib="esnext" />
/// <reference types="node" />

declare type int = number;
declare type float = number;

declare namespace __jymfony {
    /**
     * Base class for all jymfony managed objects.
     */
    export class JObject {
        /**
         * Constructor.
         */
        __construct(...args: any[]): any | undefined;
    }

    /**
     * Applies a timeout to the promise.
     */
    export function promiseTimeout<T extends AsyncFunction<K>, K>(timeoutMs: number, promise: T, timeoutError?: () => Error, weak?: boolean): Promise<K>;
    export function promiseTimeout<T extends Promise<K>, K>(timeoutMs: number, promise: T, timeoutError?: () => Error, weak?: boolean): T;

    /**
     * Executes a callback iterating asynchronously onto the given iterator.
     */
    export function forAwait(iterator: Iterable<any> | AsyncIterable<any>, callback: Invokable | Function | GeneratorFunction): Promise<any>;

    /**
     * Stops execution for the given number of ms.
     * The returned promised resolves after the time has passed.
     */
    export function sleep(ms: number): Promise<void>;

    /**
     * Gets a debug representation of the value (class name of type).
     */
    export function get_debug_type(value: any): string;

    /**
     * Emits a deprecation warning message.
     */
    export function trigger_deprecated(message: string): void;

    /**
     * Sync-recursively creates directories.
     */
    export function mkdir(dir: string, mode?: number): void;

    /**
     * Creates a function that delays invoking a function after
     * a given time has elapsed, de-duplicating calls.
     */
    export function debounce<T, P extends unknown[]>(func: Invokable<T, P>, wait: number): Invokable<T, P>;

    /**
     * Gets a method given an object and the method name.
     */
    export function getFunction<T = any, P extends unknown[] = []>(object: Object, funcName: string): (...args: [...P]) => T;

    /**
     * Clones an object.
     */
    export function clone<T extends object = any>(object: T): T;

    /**
     * Recursively clones an object and all its arrays/literal objects.
     */
    export function deepClone(object: Object): Object;

    /**
     * Recursively merges literal objects/arrays.
     */
    export function deepMerge(...args: (any[]|Record<any, any>)[]): any|Object;

    /**
     * Calculate object difference by keys.
     */
    export function diffKey(arr1: any[]|Record<any, any>, ...arrs: (any[]|Record<any, any>)[]): Object;

    /**
     * Get key, value pairs from any object.
     */
    export function getEntries<V>(object: V[]|Set<V>): IterableIterator<[number, V]>;
    export function getEntries<T, K extends keyof T>(object: T): IterableIterator<[K, T[K]]>;

    /**
     * Deep-equality check.
     */
    export function equal(left: any, right: any, strict?: boolean): boolean;

    /**
     * Get object keys.
     */
    export function keys(obj: any[]): number[];
    export function keys<K extends string | number | symbol>(obj: Record<K, any>): K[];
    export function keys<K>(obj: Map<K, any>): K[];

    /**
     * Returns an object with the common keys only.
     */
    export function intersect_key(obj: any[]|Record<any, any>, ...arrays: (any[]|Record<any, any>)[]): Record<any, any>;

    /**
     * Merges arrays or objects.
     */
    export function objectMerge(...args: any[]): any;

    /**
     * Converts a key-value object to a Map object.
     */
    export function obj2map(obj: Record<any, any>): Map<any, any>;

    /**
     * Converts a Map object to a key-value object.
     */
    export function map2obj(obj: Map<any, any>): Record<any, any>;

    /**
     * Serializes any value to a string.
     */
    export function serialize(value: any): string;

    /**
     * Unserializes values from a serialized string.
     */
    export function unserialize(serialized: string, options?: { allowedClasses?: boolean | string[], throwOnInvalidClass?: boolean }): any;

    /**
     * Escapes a regex pattern.
     */
    export function regex_quote(str: string): string;

    /**
     * Calculates a CRC32 of a string.
     */
    export function crc32(stringOrBuffer: string|Buffer): number;

    /**
     * Escapes a shell argument.
     */
    export function escapeshellarg(arg: string): string;

    /**
     * Encodes a string with html entities.
     */
    export function htmlentities (string: string, quoteStyle?: 'ENT_COMPAT' | 'ENT_NOQUOTES' | 'ENT_QUOTES', doubleEncode?: string): string

    /**
     * Calculates the levenshtein distance between two strings.
     */
    export function levenshtein(s: string, t: string): number;

    /**
     * Converts unicode domains to ascii.
     */
    export function punycode_to_ascii(string: string): string;

    /**
     * @internal
     */
    export function internal_parse_query_string(params: any): any;

    /**
     * Parses a query string and returns a kv object.
     */
    export function parse_query_string(str: string): Record<string, any>;

    /**
     * Formats values into a string.
     */
    export function sprintf(format: string, ...args: any[]): string;

    export const STR_PAD_RIGHT = 'STR_PAD_RIGHT';
    export const STR_PAD_LEFT = 'STR_PAD_LEFT';
    export const STR_PAD_BOTH = 'STR_PAD_BOTH';

    /**
     * Pad a string to a certain length with another string.
     */
    export function str_pad(string: string, length?: number, pad?: string, padType?: 'STR_PAD_RIGHT' | 'STR_PAD_LEFT' | 'STR_PAD_BOTH'): string;

    /**
     * The strcspn() function returns the number of characters (including whitespaces)
     * found in a string before any part of the specified characters are found.
     */
    export function strcspn(str: string, mask: string, start?: number, length?: number): number;

    /**
     * Strips HTML tags from a string.
     */
    export function strip_tags(input: string, allowed?: string): string;

    /**
     * Replaces parts of strings.
     */
    export function strtr(str: string, replacePairs: Record<string, string>): string;
    export function strtr(str: string, from: string, to: string): string;

    /**
     * Replace text within a portion of a string.
     */
    export function substr_replace(search: string, replacement: string, start: number, length?: number): string;
    export function substr_replace(search: string[], replacement: string[], start: number[], length?: number[]): string[];

    /**
     * Trim characters at the end of a string.
     */
    export function rtrim(str: string, charList?: string): string;

    /**
     * Trim characters at the beginning of a string.
     */
    export function ltrim(str: string, charList?: string): string;

    /**
     * Trim characters at the beginning and at the end of a string.
     */
    export function trim(str: string, charList?: string): string;

    /**
     * Make the first character upper-case and the rest lower-case.
     */
    export function ucfirst(str: string): string;

    /**
     * Make the first character of each word upper-case and the rest lower-case.
     */
    export function ucwords(str: string): string;

    /**
     * If operator parameter is undefined returns -1 if version1 is
     * lower than version2, 0 if they are equal, 1 if the second is lower
     *
     * Otherwise, returns true if the relationship is the one specified
     * by the operator, false otherwise
     */
    export function version_compare(version1: string|number, version2: string|number): number;
    export function version_compare(version1: string|number, version2: string|number, operator: '<'|'lt'|'<='|'le'|'>'|'gt'|'>='|'ge'|'=='|'='|'eq'|'!='|'<>'|'ne'): boolean;

    /**
     * Wraps a string to a given number of characters.
     */
    export function wordwrap(str: string, width?: number, strBreak?: string, cut?: boolean): string;
}

interface WeakRef<T extends WeakKey> {
    readonly [Symbol.toStringTag]: "WeakRef";

    /**
     * Returns the WeakRef instance's target value, or undefined if the target value has been
     * reclaimed.
     * In es2023 the value can be either a symbol or an object, in previous versions only object is permissible.
     */
    deref(): T | undefined;
}

interface WeakRefConstructor {
    readonly prototype: WeakRef<any>;

    /**
     * Creates a WeakRef instance for the given target object.
     * @param target The target object for the WeakRef instance.
     */
    new<T extends object>(target?: T): WeakRef<T>;
}

declare var WeakRef: WeakRefConstructor;

declare type Nullable<T> = {
    [P in keyof T]: null | T[P];
};

declare type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
declare type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

declare type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
declare type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type IfEquals<X, Y, A=X, B=never> =
    (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;

declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

declare type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>
}[keyof T];

type SuppressNew<T> = {
    [ K in keyof T ] : T[ K ]
}

declare type AnyConstructorRaw<Instance extends object = object, Static extends object = object> = (new (...input : any[]) => Instance) & Static;
declare type Newable<Instance extends object = object, Static extends object = object> = (new (...input : any[]) => Instance) & SuppressNew<Static>;

declare type MixinInterface<T> = T extends AnyConstructorRaw<infer I, infer M> ? Omit<M, 'definition'> & {
    readonly definition: Newable<I, T>;
    [Symbol.hasInstance](): boolean;
} & ((...args: any[]) => any) : never;

type ArrayIntersection<T extends readonly unknown[]> = T extends [infer Head, ...infer Rest] ?
    Head & ArrayIntersection<Rest> : unknown;

declare type Mixin<T> = T extends Newable ? MixinInterface<T> : never;
declare type ClassRaw<Instance extends object, Static> = SuppressNew<Static> & {
    prototype: Instance;
};

declare type ClassArrayIntersection<T extends unknown[]> = T extends [infer Base extends ClassRaw<infer IHead extends object, infer IStatic extends object>, ...infer Rest] ?
    ClassRaw<IHead, IStatic> & ClassArrayIntersection<Rest> : unknown;

declare function getInterface<T, P extends unknown[]>(definition: T, ...parents: [...P]): T extends Newable ? MixinInterface<ArrayIntersection<[T, ...P]>> : never;
declare function getTrait<T>(definition: T): Mixin<T>;
declare function mix<CBase, TParams extends unknown[]>(base: CBase, ...interfaces: [...TParams]):
    CBase extends ClassRaw<infer IBase, infer TBase> ?
        Newable<IBase, TBase & __jymfony.JObject> & ClassArrayIntersection<TParams> : never;
declare function implementationOf<TParams extends unknown[]>(...interfaces: [...TParams]): ArrayIntersection<TParams> & typeof __jymfony.JObject & any;

declare type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

interface AsyncGenerator<T = unknown, TReturn = any, TNext = any> extends AsyncIteratorObject<T, TReturn, TNext> {
    // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
    next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw(e: any): Promise<IteratorResult<T, TReturn>>;
    [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
}

interface AsyncGeneratorFunction {
    /**
     * Creates a new AsyncGenerator object.
     * @param args A list of arguments the function accepts.
     */
    new (...args: any[]): AsyncGenerator;

    /**
     * Creates a new AsyncGenerator object.
     * @param args A list of arguments the function accepts.
     */
    (...args: any[]): AsyncGenerator;

    /**
     * The length of the arguments.
     */
    readonly length: number;

    /**
     * Returns the name of the function.
     */
    readonly name: string;

    /**
     * A reference to the prototype.
     */
    readonly prototype: AsyncGenerator;
}

declare module NodeJS {
    interface Global {
        __jymfony: any;
        BoundFunction: Newable<BoundFunction<any, any>>;
        EmptyIterator: Newable<EmptyIterator>;
        RecursiveDirectoryIterator: Newable<RecursiveDirectoryIterator>;

        getInterface<T, P extends unknown[]>(definition: T, ...parents: [...P]): T extends Newable ? MixinInterface<ArrayIntersection<[T, ...P]>> : never;
        getTrait<T>(definition: T): T extends Newable<infer I, infer M> ? MixinInterface<T> : never;
        mixins: {
            isInterface: <T extends Newable<any>>(mixin: T) => boolean,
            isTrait: <T extends Newable<any>>(mixin: T) => boolean,
            getParents: <T extends Newable>(Class: T) => MixinInterface<T>[],
            getInterfaces: <T extends Newable>(Class: T) => MixinInterface<T>[],
            getTraits: <T extends Newable>(Class: T) => MixinInterface<T>[],

            /**
             * @internal
             */
            initializerSymbol: symbol
        }

        mix<CBase, TParams extends unknown[]>(base: CBase, ...interfaces: [...TParams]):
            CBase extends ClassRaw<infer IBase, infer TBase> ?
                Newable<IBase, TBase & __jymfony.JObject> & ClassArrayIntersection<TParams> : never;
        implementationOf<TParams extends unknown[]>(...interfaces: [...TParams]): ArrayIntersection<TParams> & typeof __jymfony.JObject & any;

        isArguments(value: any): value is IArguments;
        isBigInt(value: any): value is bigint;
        isBoolean(value: any): value is boolean;
        isString(value: any): value is string;
        isNumber(value: any): value is number;
        isInfinite<T>(value: T): T extends number ? boolean : false;
        isNumeric<T>(value: T): T extends number ? true : boolean;
        isDate(value: any): value is Date;
        isRegExp(value: any): value is RegExp;
        isError(value: any): value is Error;
        isSymbol(value: any): value is symbol;
        isMap(value: any): value is Map<any, any>;
        isWeakMap(value: any): value is WeakMap<any, any>;
        isSet(value: any): value is Set<any>;
        isWeakSet(value: any): value is WeakSet<any>;

        isGenerator(value: any): value is Generator;
        isGeneratorFunction(value: any): value is GeneratorFunction | AsyncGeneratorFunction;
        isAsyncFunction(value: any): value is AsyncFunction;
        isFunction(value: any): value is Invokable;
        isArray(value: any): value is Array<any>;
        isArray<T>(value: any): value is Array<T>;
        isBuffer(value: any): value is Buffer;
        isObject(value: any): value is object;
        isScalar(value: any): value is string | boolean | number;
        isObjectLiteral(value: any): value is Object;
        isPromise(value: any): value is Promise<any>;
        isStream(value: any): value is NodeJS.ReadableStream | NodeJS.WritableStream;
        isCallableArray(value: any): value is [string, string];
        getCallableFromArray<T = any>(value: [object, string]): Invokable<T>;
    }
}

declare type Invokable<T = any, A extends unknown[] = []> = (...args: any[]) => T | {
    __invoke(...args: [...A]): (...args: [...A]) => T;
};

declare function isArguments(value: any): value is IArguments;
declare function isBigInt(value: any): value is bigint;
declare function isBoolean(value: any): value is boolean;
declare function isString(value: any): value is string;
declare function isNumber(value: any): value is number;
declare function isNaN<T>(value: T): T extends number ? boolean : false;
declare function isInfinite<T>(value: T): T extends number ? boolean : false;
declare function isNumeric<T>(value: T): T extends number ? true : boolean;
declare function isDate(value: any): value is Date;
declare function isRegExp(value: any): value is RegExp;
declare function isError(value: any): value is Error;
declare function isSymbol(value: any): value is symbol;
declare function isMap(value: any): value is Map<any, any>;
declare function isWeakMap(value: any): value is WeakMap<any, any>;
declare function isSet(value: any): value is Set<any>;
declare function isWeakSet(value: any): value is WeakSet<any>;

declare function isGenerator(value: any): value is Generator;
declare function isGeneratorFunction(value: any): value is GeneratorFunction | AsyncGeneratorFunction;
declare function isAsyncFunction(value: any): value is AsyncFunction;
declare function isFunction(value: any): value is Invokable;
declare function isArray(value: any): value is Array<any>;
declare function isBuffer(value: any): value is Buffer;
declare function isObject(value: any): value is object;
declare function isScalar(value: any): value is string | boolean | number;
declare function isObjectLiteral(value: any): value is Object;
declare function isPromise(value: any): value is Promise<any>;
declare function isStream(value: any): value is NodeJS.ReadableStream | NodeJS.WritableStream;
declare function isCallableArray(value: any): value is [string, string];
declare function getCallableFromArray<T = any>(value: [object, string]): Invokable<T>;

declare interface BoundFunction<T, P extends unknown[]> extends Function {
    new(thisArg: Object, func: Invokable<T, P>): Invokable<T, P>;
    new(thisArg: Object, func: string|symbol): Invokable<T, P>;

    arguments: any;
    caller: Function;
    readonly length: number;
    readonly name: string;
    prototype: any;
    [Symbol.hasInstance](value: any): boolean;
    apply(thisArg: any, argArray?: P): T;
    bind(thisArg: any, ...argArray: [...P]): this;
    call(thisArg: any, ...argArray: [...P]): T;
}

declare class EmptyIterator<T = any> implements Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}

interface ObjectConstructor {
    filter: <T>(obj: T, predicate: Invokable<boolean>) => T;
    ksort: <T>(obj: T) => T;
    sort: <T>(obj: T) => T;
}

declare class RecursiveDirectoryIterator implements Iterator<string>, Iterable<string> {
    private _path: string;
    private _dir: undefined|string[];
    private _current: undefined|string;

    /**
     * Constructor.
     */
    __construct(filepath: string): void;
    constructor(filepath: string);

    /**
     * Make this object iterable.
     */
    [Symbol.iterator](): RecursiveDirectoryIterator;

    /**
     * Iterates over values.
     */
    next(): IteratorResult<string>;
}
