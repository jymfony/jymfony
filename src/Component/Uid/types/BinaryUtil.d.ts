declare namespace Jymfony.Component.Uid {
    /**
     * @internal
     */
    export class BinaryUtil {
        public static readonly BASE10: Record<string, string | number>;
        public static readonly BASE58: Record<string, string | number>;

        static toBase(input: Buffer, map: Record<string, string | number>): string;
        static fromBase(input: string, map: Record<string, string | number>): Buffer;
        static add(a: string, b: string): string;
        static timeToFloat(time: string): number;
    }
}
