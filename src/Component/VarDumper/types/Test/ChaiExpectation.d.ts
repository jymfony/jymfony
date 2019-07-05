/// <reference types="chai" />

declare namespace Chai {
    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        dumpsAs(other: any): void;
        dumpsAsFormat(other: any): void;
    }

    interface Assert {
        dumpsAs(other: any): void;
        dumpsAsFormat(other: any): void;
    }
}
