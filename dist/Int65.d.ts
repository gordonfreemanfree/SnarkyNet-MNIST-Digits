import { Field, UInt64, CircuitValue } from 'snarkyjs';
export { Int65 };
declare class Int65 extends CircuitValue {
    magnitude: Field;
    sign: Field;
    constructor(magnitude: Field, sign: Field);
    static fromFieldUnchecked(x: Field): Int65;
    static fromUnsigned(x: UInt64): Int65;
    static fromNumber(x: number): Int65;
    static fromString(x: string): Int65;
    static fromBigInt(x: bigint): Int65;
    toString(): string;
    isConstant(): boolean;
    static check(x: Int65): void;
    static get zero(): Int65;
    toField(): Field;
    static fromField(x: Field): Int65;
    neg(): Int65;
    add(y: Int65): Int65;
    sub(y: Int65): Int65;
    mul(y: Int65): Int65;
    div(y: Int65): Int65;
    mod(y: UInt64): Int65;
    equals(y: Int65): import("snarkyjs").Bool;
    assertEquals(y: Int65): void;
}
