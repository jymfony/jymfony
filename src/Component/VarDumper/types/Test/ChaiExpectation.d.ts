/// <reference types="chai" />

declare namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        dump.as(other: any): void;
        dump.as.format(other: any): void;
    }

    interface Assert {
        dump.as(other: any): void;
        dump.as.format(other: any): void;
    }
}
