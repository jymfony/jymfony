declare namespace Jymfony.Component.Runtime {
    export class RunnerInterface {
        public static readonly definition: Newable<RunnerInterface>;

        run(): Promise<number | any>;
    }
}
