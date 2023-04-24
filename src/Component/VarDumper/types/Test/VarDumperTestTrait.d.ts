declare namespace Jymfony.Component.VarDumper.Test {
    export class VarDumperTestTrait {
        private _varDumperConfig: { flags: null; casters: any[] };

        __construct(): void;
        constructor();

        protected _setUpVarDumper(casters?: [Newable, Function][], flags?: number): void;
        private _tearDownVarDumper(): void;

        assertDumpEquals(expected: any, data: any, filter?: number, message?: string): void;
        assertDumpMatchesRegexp(expected: RegExp | any, data: any, filter?: number, message?: string): void;
        assertDumpMatchesFormat(expected: string | any, data: any, filter?: number, message?: string): void;

        protected getDump(data: any, key?: string | null, filter?: number): string;
        private prepareExpectation(expected: any, filter: number): string;
    }
}
