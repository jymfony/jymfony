declare module NodeJS {
    interface Global {
        dump<T = any>(variable: T): T;
        dump<T0 = any, T1 = any>(variable: T0, var1: T1): [T0, T1];
        dump<T0 = any, T1 = any, T2 = any>(variable: T0, var1: T1, var2: T2): [T0, T1, T2];
        dump<T0 = any, T1 = any, T2 = any, T3 = any>(variable: T0, var1: T1, var2: T2, var3: T3): [T0, T1, T2, T3];
        dump<T0 = any, T1 = any, T2 = any, T3 = any, T4 = any>(variable: T0, var1: T1, var2: T2, var3: T3, var4: T4): [T0, T1, T2, T3, T4];
        dump<T0 = any, T1 = any, T2 = any, T3 = any, T4 = any, T5 = any>(variable: T0, var1: T1, var2: T2, var3: T3, var4: T4, var5: T5): [T0, T1, T2, T3, T4, T5];
        dump(variable: any, ...moreVars: any[]): any[];

        dd(...vars: any[]): never;
    }
}
