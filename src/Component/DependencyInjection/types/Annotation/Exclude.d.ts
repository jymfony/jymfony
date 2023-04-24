declare namespace Jymfony.Component.DependencyInjection.Annotation {
    export class Exclude {
        private _env: string | undefined;

        __construct(env?: string | undefined): void;
        constructor(env?: string | undefined);

        public readonly env: string | undefined;
    }
}
