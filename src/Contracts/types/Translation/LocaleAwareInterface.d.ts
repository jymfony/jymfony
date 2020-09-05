declare namespace Jymfony.Contracts.Translation {
    export class LocaleAwareInterface {
        public static readonly definition: Newable<LocaleAwareInterface>;

        /**
         * The current locale.
         *
         * @throws {InvalidArgumentException} If the locale contains invalid characters
         */
        public locale: string;
    }
}
