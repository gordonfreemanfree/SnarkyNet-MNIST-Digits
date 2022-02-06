import { CircuitValue, Field, UInt64, UInt32, Bool } from 'snarkyjs';
declare class Sgn extends CircuitValue {
    value: Field;
    static check(x: Sgn): void;
    constructor(value: Field);
    static get Pos(): Sgn;
    static get Neg(): Sgn;
}
export declare class Int64 {
    value: Field;
    static NUM_BITS: number;
    static check(): void;
    constructor(x: Field);
    toString(): string;
    static get zero(): Int64;
    static fromUnsigned(x: UInt64): Int64;
    private static shift;
    uint64Value(): Field;
    static sizeInFields(): number;
    neg(): Int64;
    add(y: Int64 | UInt32 | UInt64): Int64;
    sub(y: Int64 | UInt32 | UInt64): Int64;
    repr(): {
        magnitude: Field;
        isPos: Sgn;
    };
    static toFields(x: Int64): Field[];
    static ofFields(xs: Field[]): Int64;
    toFields(): Field[];
    sizeInFields(): number;
    divMod(y: Int64 | number): [Int64, Int64];
    /** Integer division.
     *
     * `x.div(y)` returns the floor of `x / y`, that is, the greatest
     * `z` such that `x * y <= x`.
     *
     */
    div(y: Int64 | number): Int64;
    /** Integer remainder.
     *
     * `x.mod(y)` returns the value `z` such that `0 <= z < y` and
     * `x - z` is divisble by `y`.
     */
    mod(y: Int64 | number): Int64;
    /** Multiplication with overflow checking.
     */
    mul(y: Int64 | number): Int64;
    lte(y: Int64): Bool;
    assertLte(y: Int64): void;
    lt(y: Int64): Bool;
    assertLt(y: Int64): void;
    gt(y: Int64): Bool;
    assertGt(y: Int64): void;
}
export {};
