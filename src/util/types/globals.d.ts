/// <reference lib="esnext" />

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
        __construct(...args: any[]);
    }

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
    export function debounce(func: Invokable|Function|GeneratorFunction, wait: number): Function;

    /**
     * Gets a method given an object and the method name.
     */
    export function getFunction(object: Object, funcName: string): Function;

    /**
     * Clones an object.
     */
    export function clone(object: Object): Object;

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
    export function getEntries<V>(object: V[]): IterableIterator<[number, V]>;
    export function getEntries<K extends string | number | symbol, V>(object: Record<K, V>): IterableIterator<[K, V]>;

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
    export function unserialize(serialized: string): any;

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
     * Otherwise returns true if the relationship is the one specified
     * by the operator, false otherwise
     */
    export function version_compare(version1: string|number, version2: string|number, operator?: string|undefined): boolean|number;

    /**
     * Wraps a string to a given number of characters.
     */
    export function wordwrap(str: string, width?: number, strBreak?: string, cut?: boolean): string;
}

declare interface Newable<T> {
    new(): T;
    new(...args: any[]): T;
}
declare type Constructor<T = any> = Function | { prototype: T };

declare class MixinInterface {
    public static readonly definition: Newable<any>;
}

declare function getInterface<T = any>(definition: T): T & MixinInterface;
declare function getTrait<T = any>(definition: T): T & MixinInterface;

declare type AsyncFunction = (...args: any[]) => Promise<any>;
declare type AsyncGeneratorFunction = (...args: any[]) => AsyncIterator<any>;

declare module NodeJS {
    interface Global {
        __jymfony: any;
        BoundFunction: Newable<BoundFunction>;
        EmptyIterator: Newable<EmptyIterator>;

        getInterface<T extends Newable<any> = any>(definition: T): T & MixinInterface;
        getTrait<T extends Newable<any> = any>(definition: T): T & MixinInterface;
        mixins: {
            isInterface: <T extends Newable<any>>(mixin: T) => boolean,
            isTrait: <T extends Newable<any>>(mixin: T) => boolean,
            getInterfaces: <T extends Newable<any>>(Class: T) => MixinInterface[],

            /**
             * @internal
             */
            initializerSymbol: symbol
        }

        mix<T = any>(base: undefined): Newable<__jymfony.JObject>;
        mix<T = any>(base: Constructor<T>): Newable<__jymfony.JObject & T>;
        mix<T, I0>(base: undefined | Constructor<T>, iface: Newable<I0>): Newable<__jymfony.JObject & T & I0>;
        mix<T, I0, I1>(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>): Newable<__jymfony.JObject & T & I0 & I1>;
        mix<T, I0, I1, I2>(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>): Newable<__jymfony.JObject & T & I0 & I1 & I2>;

        mix<T, I0, I1, I2, I3>
        (base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>):
            Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3>;
        mix<T, I0, I1, I2, I3, I4>
        (base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>):
            Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4>;
        mix<T, I0, I1, I2, I3, I4, I5>
        (base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>):
            Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4 & I5>;
        mix<T, I0, I1, I2, I3, I4, I5, I6>
        (base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>, interface6: Newable<I6>):
            Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4 & I5 & I6>;
        mix<T>
        (base: undefined | Constructor<T>, ...interfacesAndTraits: any[]): Newable<__jymfony.JObject & T & any>;

        implementationOf<I0>(iface: Newable<I0>): Newable<__jymfony.JObject & I0>;
        implementationOf<I0, I1>(interface0: Newable<I0>, interface1: Newable<I1>): Newable<__jymfony.JObject & I0 & I1>;
        implementationOf<I0, I1, I2>(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>): Newable<__jymfony.JObject & I0 & I1 & I2>;

        implementationOf<I0, I1, I2, I3>
        (interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>):
            Newable<__jymfony.JObject & I0 & I1 & I2 & I3>;
        implementationOf<I0, I1, I2, I3, I4>
        (interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>):
            Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4>;
        implementationOf<I0, I1, I2, I3, I4, I5>
        (interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>):
            Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4 & I5>;
        implementationOf<I0, I1, I2, I3, I4, I5, I6>
        (interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: I5, interface6: Newable<I6>):
            Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4 & I5 & I6>;
        implementationOf(...interfacesAndTraits: any[]): Newable<__jymfony.JObject & any>;

        isArguments(value: any): value is IArguments;
        isBoolean(value: any): value is boolean;
        isString(value: any): value is string;
        isNumber(value: any): value is number;
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
        isBuffer(value: any): value is Buffer;
        isObject(value: any): value is object;
        isScalar(value: any): value is string | boolean | number;
        isObjectLiteral(value: any): value is Object;
        isPromise(value: any): value is Promise<any>;
        isStream(value: any): value is NodeJS.ReadableStream | NodeJS.WritableStream;
        isCallableArray(value: any): value is [string, string];
        getCallableFromArray(value: [string, string]): Invokable<any>;
    }
}

declare type Invokable<T = any> = (...args: any[]) => T | {
    __invoke<A extends any[]>(...args: A): (...args: A) => T;
    __invoke<A0, A extends any[]>(arg0: A0, ...args: A): (...args: A) => T;
    __invoke<A0, A1, A extends any[]>(arg0: A0, arg1: A1, ...args: A): (...args: A) => T;
    __invoke<A0, A1, A2, A extends any[]>(arg0: A0, arg1: A1, arg2: A2, ...args: A): (...args: A) => T;
    __invoke<A0, A1, A2, A3, A extends any[]>(arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...args: A): (...args: A) => T;
    __invoke<AX>(...args: AX[]): (...args: AX[]) => T;
};

declare function mix<T = any>(base: undefined): Newable<__jymfony.JObject>;
declare function mix<T = any>(base: Constructor<T>): Newable<__jymfony.JObject & T>;
declare function mix<T, I0>(base: undefined | Constructor<T>, iface: Newable<I0>): Newable<__jymfony.JObject & T & I0>;
declare function mix<T, I0, I1>(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>): Newable<__jymfony.JObject & T & I0 & I1>;
declare function mix<T, I0, I1, I2>(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>): Newable<__jymfony.JObject & T & I0 & I1 & I2>;

declare function mix<T, I0, I1, I2, I3>
(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>):
    Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3>;
declare function mix<T, I0, I1, I2, I3, I4>
(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>):
    Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4>;
declare function mix<T, I0, I1, I2, I3, I4, I5>
(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>):
    Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4 & I5>;
declare function mix<T, I0, I1, I2, I3, I4, I5, I6>
(base: undefined | Constructor<T>, interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>, interface6: Newable<I6>):
    Newable<__jymfony.JObject & T & I0 & I1 & I2 & I3 & I4 & I5 & I6>;
declare function mix<T>
(base: undefined | Constructor<T>, ...interfacesAndTraits: any[]): Newable<__jymfony.JObject & T & any>;

declare function implementationOf<I0>(iface: Newable<I0>): Newable<__jymfony.JObject & I0>;
declare function implementationOf<I0, I1>(interface0: Newable<I0>, interface1: Newable<I1>): Newable<__jymfony.JObject & I0 & I1>;
declare function implementationOf<I0, I1, I2>(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>): Newable<__jymfony.JObject & I0 & I1 & I2>;

declare function implementationOf<I0, I1, I2, I3>
(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>):
    Newable<__jymfony.JObject & I0 & I1 & I2 & I3>;
declare function implementationOf<I0, I1, I2, I3, I4>
(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>):
    Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4>;
declare function implementationOf<I0, I1, I2, I3, I4, I5>
(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: Newable<I5>):
    Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4 & I5>;
declare function implementationOf<I0, I1, I2, I3, I4, I5, I6>
(interface0: Newable<I0>, interface1: Newable<I1>, interface2: Newable<I2>, interface3: Newable<I3>, interface4: Newable<I4>, interface5: I5, interface6: Newable<I6>):
    Newable<__jymfony.JObject & I0 & I1 & I2 & I3 & I4 & I5 & I6>;
declare function implementationOf(...interfacesAndTraits: any[]): Newable<__jymfony.JObject & any>;

declare function isArguments(value: any): value is IArguments;
declare function isBoolean(value: any): value is boolean;
declare function isString(value: any): value is string;
declare function isNumber(value: any): value is number;
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
declare function getCallableFromArray(value: [string, string]): Invokable<any>;

declare class BoundFunction implements Function {
    new(thisArg: Object, func: Invokable|Function|GeneratorFunction): Function;

    arguments: any;
    caller: Function;
    readonly length: number;
    readonly name: string;
    prototype: any;
    [Symbol.hasInstance](value: any): boolean;
    apply(thisArg: any, argArray?: any): any;
    bind(thisArg: any, ...argArray: any[]): any;
    call(thisArg: any, ...argArray: any[]): any;
}

declare class EmptyIterator<T = any> implements Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}

interface ObjectConstructor {
    filter: <T>(obj: T, predicate: Invokable<boolean>) => T;
    ksort: <T>(obj: T) => T;
    sort: <T>(obj: T) => T;
}
