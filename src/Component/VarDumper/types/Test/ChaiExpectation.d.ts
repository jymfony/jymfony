/// <reference types="chai" />

declare namespace Chai {
    interface DumpAs {
        (other: any): Assertion;
        format(other: any): Assertion;
    }

    interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
        dump: Assertion;
        as: DumpAs;
    }

    interface Assert {
        dump: Assertion;
        as: DumpAs;
    }
}
