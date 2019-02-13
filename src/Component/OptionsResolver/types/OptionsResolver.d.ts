declare namespace Jymfony.Component.OptionsResolver {
    /**
     * Validates options and merges them with default values.
     */
    export class OptionsResolver {
        /**
         * The names of all defined options.
         */
        private _defined: Record<string, boolean>;

        /**
         * The default option values.
         */
        private _defaults: Record<string, any>;

        /**
         * The names of required options.
         */
        private _required: Record<string, boolean>;

        /**
         * The resolved option values.
         */
        private _resolved: Record<string, any>;

        /**
         * A list of normalizer closures.
         */
        private _normalizers: Record<string, Invokable<any>>;

        /**
         * A list of accepted values for each option.
         */
        private _allowedValues: Record<string, any[]>;

        /**
         * A list of accepted types for each option.
         */
        private _allowedTypes: Record<string, (string | Newable<any>)[]>;

        /**
         * A list of closures for evaluating lazy options.
         */
        private _lazy: Record<string, Invokable[]>;

        /**
         * A list of lazy options whose closure is currently being called.
         * This list helps detecting circular dependencies between lazy options.
         */
        private _calling: Record<string, boolean>;

        /**
         * Whether the instance is locked for reading.
         *
         * Once locked, the options cannot be changed anymore. This is
         * necessary in order to avoid inconsistencies during the resolving
         * process. If any option is changed after being read, all evaluated
         * lazy options that depend on this option would become invalid.
         */
        private _locked: boolean;

        /**
         * Constructor.
         */
        __construct(): void;
        constructor();

        /**
         * Returns the number of set options.
         *
         * This may be only a subset of the defined options.
         *
         * @returns Number of options
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
         */
        public readonly length: number;

        /**
         * Sets the default value of a given option.
         *
         * @param option The name of the option
         * @param value The default value of the option
         * @param [lazy = false] If the option should be lazy-evaluated
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidArgumentException} If lazy is true, but value is not a function
         */
        setDefault(option: string, value: any, lazy?: boolean): this;

        /**
         * Sets a list of default values.
         *
         * @param defaults The default values to set
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setDefaults(defaults: Record<string, any>): this;

        /**
         * Returns whether a default value is set for an option.
         *
         * Returns true if {@link setDefault()} was called for this option.
         * An option is also considered set if it was set to null.
         *
         * @param option The option name
         *
         * @returns Whether a default value is set
         */
        hasDefault(option: string): boolean;

        /**
         * Marks one or more options as required.
         *
         * @param optionNames One or more option names
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setRequired(optionNames: string | string[]): this;

        /**
         * Returns whether an option is required.
         *
         * An option is required if it was passed to {@link setRequired()}.
         *
         * @param option The name of the option
         *
         * @returns Whether the option is required
         */
        isRequired(option: string): boolean;

        /**
         * Returns the names of all required options.
         *
         * @returns The names of the required options
         *
         * @see isRequired()
         */
        getRequiredOptions(): string[];

        /**
         * Returns whether an option is missing a default value.
         *
         * An option is missing if it was passed to {@link setRequired()}, but not
         * to {@link setDefault()}. This option must be passed explicitly to
         * {@link resolve()}, otherwise an exception will be thrown.
         *
         * @param option The name of the option
         *
         * @returns Whether the option is missing
         */
        isMissing(option: string): boolean;

        /**
         * Returns the names of all options missing a default value.
         *
         * @returns The names of the missing options
         *
         * @see isMissing()
         */
        getMissingOptions(): string[];

        /**
         * Defines a valid option name.
         *
         * Defines an option name without setting a default value. The option will
         * be accepted when passed to {@link resolve()}. When not passed, the
         * option will not be included in the resolved options.
         *
         * @param optionNames One or more option names
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setDefined(optionNames: string | string[]): this;

        /**
         * Returns whether an option is defined.
         *
         * Returns true for any option passed to {@link setDefault()},
         * {@link setRequired()} or {@link setDefined()}.
         *
         * @param option The option name
         *
         * @returns Whether the option is defined
         */
        isDefined(option: string): boolean;

        /**
         * Returns the names of all defined options.
         *
         * @returns The names of the defined options
         *
         * @see isDefined()
         */
        getDefinedOptions(): string[];

        /**
         * Sets the normalizer for an option.
         *
         * The normalizer should be a closure with the following signature:
         *
         * ```js
         * function (options, value) {
         *     // ...
         * }
         * ```
         *
         * The closure is invoked when {@link resolve()} is called. The closure
         * has access to the resolved values of other options through the passed
         * {@link OptionsResolver} instance.
         *
         * The second parameter passed to the closure is the value of
         * the option.
         *
         * The resolved option value is set to the return value of the closure.
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setNormalizer(option: string, normalizer: Invokable<any>): this;

        /**
         * Sets allowed values for an option.
         *
         * Instead of passing values, you may also pass a closures with the
         * following signature:
         *
         * ```js
         * function (value) {
         *     // return true or false
         * }
         * ```
         *
         * The closure receives the value as argument and should return true to
         * accept the value and false to reject the value.
         *
         * @param option The option name
         * @param allowedValues One or more acceptable values/closures
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setAllowedValues(option: string, allowedValues: any[]): this;

        /**
         * Adds allowed values for an option.
         *
         * The values are merged with the allowed values defined previously.
         *
         * Instead of passing values, you may also pass a closures with the
         * following signature:
         *
         * ```js
         * function (value) {
         *     // return true or false
         * }
         * ```
         *
         * The closure receives the value as argument and should return true to
         * accept the value and false to reject the value.
         *
         * @param option The option name
         * @param allowedValues One or more acceptable values/closures
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        addAllowedValues(option: string, allowedValues: any[]): this;

        /**
         * Sets allowed types for an option.
         *
         * Any type for which a corresponding is_<type>() function exists is
         * acceptable. Additionally, fully-qualified class or interface names may
         * be passed.
         *
         * @param option The option name
         * @param allowedTypes One or more accepted types
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        setAllowedTypes(option: string, allowedTypes: string | Newable<any> | (string | Newable<any>)[]): this;

        /**
         * Adds allowed types for an option.
         *
         * The types are merged with the allowed types defined previously.
         *
         * Any type for which a corresponding is_<type>() function exists is
         * acceptable. Additionally, fully-qualified class or interface names may
         * be passed.
         *
         * @param option The option name
         * @param allowedTypes One or more accepted types
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If the option is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        addAllowedTypes(option: string, allowedTypes: string | Newable<any> | (string | Newable<any>)[]): this;

        /**
         * Removes the option with the given name.
         *
         * Undefined options are ignored.
         *
         * @param optionNames One or more option names
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        remove(optionNames: string | string[]): this;

        /**
         * Removes all options.
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        clear(): this;

        /**
         * Merges options with the default values stored in the container and
         * validates them.
         *
         * Exceptions are thrown if:
         *
         *  - Undefined options are passed;
         *  - Required options are missing;
         *  - Options have invalid types;
         *  - Options have invalid values.
         *
         * @param options A map of option names to values
         *
         * @returns The merged and validated options
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.UndefinedOptionsException} If an option name is undefined
         * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidOptionsException} If an option doesn't fulfill the specified validation rules
         * @throws {Jymfony.Component.OptionsResolver.Exception.MissingOptionsException} If a required option is missing
         * @throws {Jymfony.Component.OptionsResolver.Exception.OptionDefinitionException} If there is a cyclic dependency between lazy options and/or normalizers
         * @throws {Jymfony.Component.OptionsResolver.Exception.NoSuchOptionException} If a lazy option reads an unavailable option
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If called from a lazy option or normalizer
         */
        resolve(options?: Record<string, any>): Record<string, any>;

        /**
         * Returns the resolved value of an option.
         *
         * @param option The option name
         *
         * @returns The option value
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
         * @throws {Jymfony.Component.OptionsResolver.Exception.NoSuchOptionException} If the option is not set
         * @throws {Jymfony.Component.OptionsResolver.Exception.InvalidOptionsException} If the option doesn't fulfill the specified validation rules
         * @throws {Jymfony.Component.OptionsResolver.Exception.OptionDefinitionException} If there is a cyclic dependency between lazy options and/or normalizers
         */
        get(option: string): any;

        /**
         * Returns whether a resolved option with the given name exists.
         *
         * @param option The option name
         *
         * @returns Whether the option is set
         *
         * @throws {Jymfony.Component.OptionsResolver.Exception.AccessException} If accessing this method outside of {@link resolve()}
         */
        has(option: string): boolean;

        /**
         * Returns a string representation of the type of the value.
         *
         * This method should be used if you pass the type of a value as
         * message parameter to a constraint violation. Note that such
         * parameters should usually not be included in messages aimed at
         * non-technical people.
         *
         * @param value The value to return the type of
         *
         * @returns The type of the value
         */
        private _formatTypeOf(value: any): string;

        /**
         * Returns a string representation of the value.
         *
         * This method returns the equivalent JS tokens for most scalar types
         * (i.e. "false" for false, "1" for 1 etc.). Strings are always wrapped
         * in double quotes (").
         *
         * @param value The value to format as string
         *
         * @returns The string representation of the passed value
         */
        private _formatValue(value: any): string;

        /**
         * Returns a string representation of a list of values.
         *
         * Each of the values is converted to a string using
         * {@link _formatValue()}. The values are then concatenated with commas.
         */
        private _formatValues(values: any[]): string;
    }
}
