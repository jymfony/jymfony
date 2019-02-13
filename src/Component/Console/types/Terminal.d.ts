declare namespace Jymfony.Component.Console {
    export class Terminal {
        public static stty?: boolean;

        public static readonly hasANSISupport: boolean;

        public static readonly hasUnicodeSupport: boolean;

        static disableStty(): void;

        static hasSttyAvailable(): boolean;

        static resetStty(): boolean;

        public readonly width: number;

        public readonly height: number;
    }
}
