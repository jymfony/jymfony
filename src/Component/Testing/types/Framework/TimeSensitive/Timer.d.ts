declare namespace Jymfony.Component.Testing.Framework.TimeSensitive {
    export class Timer {
        private _handler: Function;
        private _ref: boolean;
        private _handle: number;
        __construct(handler: Function): void;
        constructor(handler: Function);

        ref(): void;

        unref(): void;

        hasRef(): boolean;

        refresh(): void;

        [Symbol.toPrimitive](): number;
    }
}
