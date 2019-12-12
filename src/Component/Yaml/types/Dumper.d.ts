declare namespace Jymfony.Component.Yaml {
    /**
     * Dumper dumps JSON variables to YAML strings.
     *
     * @final
     */
    export class Dumper {
        private _indentation: number;

        /**
         * Constructor.
         */
        __construct(indentation?: number): void;
        constructor(indentation?: number);

        /**
         * Dumps a JSON value to YAML.
         *
         * @param input The JSON value
         * @param [inline = 0] The level where you switch to inline YAML
         * @param [indent = 0] The level of indentation (used internally)
         * @param [flags = 0] A bit field of Yaml.DUMP_* constants to customize the dumped YAML string
         *
         * @returns The YAML representation of the JSON value
         */
        dump(input: any, inline?: number, indent?: number, flags?: number): string;
    }
}
