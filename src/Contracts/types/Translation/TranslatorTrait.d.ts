declare namespace Jymfony.Contracts.Translation {
    /**
     * A trait to help implement TranslatorInterface and LocaleAwareInterface.
     */
    export class TranslatorTrait {
        public static readonly definition: Newable<TranslatorTrait>;

        public locale: string;
        private _locale: string;

        /**
         * @inheritDoc
         */
        trans(id: string, parameters?: Record<string, string>, domain?: string | null, locale?: string | null): string;

        /**
         * Returns the plural position to use for the given locale and number.
         *
         * The plural rules are derived from code of the Zend Framework (2010-09-25),
         * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
         * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
         */
        getPluralizationRule(number: number, locale: string): number;
    }
}
