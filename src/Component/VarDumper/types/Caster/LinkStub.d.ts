declare namespace Jymfony.Component.VarDumper.Caster {
    /**
     * Represents a file or a URL.
     */
    export class LinkStub extends ConstStub {
        public inNodeModules: boolean;

        /**
         * Constructor.
         */
        __construct(label: string, line?: number, href?: string): void;
        constructor(label: string, line?: number, href?: string);
    }
}
