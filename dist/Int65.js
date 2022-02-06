// TODO: review and potentially make this snarkyjs' Int64
import { __decorate, __metadata } from "tslib";
import { Field, UInt64, prop, CircuitValue, Circuit, isReady } from 'snarkyjs';
export { Int65 };
class Int65 extends CircuitValue {
    constructor(magnitude, sign) {
        super();
        this.magnitude = magnitude;
        this.sign = sign;
    }
    static fromFieldUnchecked(x) {
        let MINUS_ONE = Field.one.neg();
        let FIELD_ORDER = BigInt(MINUS_ONE.toString()) + 1n;
        let TWO64 = 1n << 64n;
        let xBigInt = BigInt(x.toString());
        let isValidPositive = xBigInt < TWO64; // covers {0,...,2^64 - 1}
        let isValidNegative = FIELD_ORDER - xBigInt < TWO64; // {-2^64 + 1,...,-1}
        if (!isValidPositive && !isValidNegative)
            throw Error(`Int64.fromField expected a value between (-2^64, 2^64), got ${x}`);
        let magnitude = Field(isValidPositive ? x.toString() : x.neg().toString());
        let sign = isValidPositive ? Field.one : MINUS_ONE;
        return new Int65(magnitude, sign);
    }
    static fromUnsigned(x) {
        return new Int65(x.value, Field.one);
    }
    static fromNumber(x) {
        return Int65.fromFieldUnchecked(Field(x));
    }
    static fromString(x) {
        return Int65.fromFieldUnchecked(Field(x));
    }
    static fromBigInt(x) {
        let xField = x < 0n ? Field((-x).toString()).neg() : Field(x.toString());
        return Int65.fromFieldUnchecked(xField);
    }
    toString() {
        let abs = this.magnitude.toString();
        let sgn = this.sign.equals(Field.one).toBoolean() || abs === '0' ? '' : '-';
        return sgn + abs;
    }
    isConstant() {
        return this.magnitude.isConstant() && this.sign.isConstant();
    }
    // --- circuit-compatible operations below ---
    // the assumption here is that all Int65 values that appear in a circuit are already checked as valid
    // this is because Circuit.witness calls .check
    // so we only have to do additional checks if an operation on valid inputs can have an invalid outcome (example: overflow)
    static check(x) {
        UInt64.check(new UInt64(x.magnitude)); // |x| < 2^64
        x.sign.square().assertEquals(Field.one); // sign(x)^2 === 1
    }
    static get zero() {
        return new Int65(Field.zero, Field.one);
    }
    toField() {
        return this.magnitude.mul(this.sign);
    }
    static fromField(x) {
        let getUnchecked = () => Int65.fromFieldUnchecked(x);
        // constant case - just return unchecked value
        if (x.isConstant())
            return getUnchecked();
        // variable case - create a new checked witness and prove consistency with original field
        let xInt = Circuit.witness(Int65, getUnchecked);
        xInt.toField().assertEquals(x); // sign(x) * |x| === x
        return xInt;
    }
    neg() {
        // doesn't need further check if `this` is valid
        return new Int65(this.magnitude, this.sign.neg());
    }
    add(y) {
        return Int65.fromField(this.toField().add(y.toField()));
    }
    sub(y) {
        return Int65.fromField(this.toField().sub(y.toField()));
    }
    mul(y) {
        return Int65.fromField(this.toField().mul(y.toField()));
    }
    div(y) {
        let [q] = new UInt64(this.magnitude).divMod(new UInt64(y.magnitude));
        let sign = this.sign.mul(y.sign);
        return new Int65(q.value, sign);
    }
    mod(y) {
        let [, r] = new UInt64(this.magnitude).divMod(y);
        return new Int65(r.value, this.sign);
    }
    equals(y) {
        return this.toField().equals(y.toField());
    }
    assertEquals(y) {
        this.toField().assertEquals(y.toField());
    }
}
__decorate([
    prop,
    __metadata("design:type", Field)
], Int65.prototype, "magnitude", void 0);
__decorate([
    prop,
    __metadata("design:type", Field)
], Int65.prototype, "sign", void 0);
// test();
async function test() {
    await isReady;
    let x = Int65.fromNumber(-128);
    let y = new Int65(Field(128), Field(1));
    // check arithmetic
    x.add(y).assertEquals(Int65.zero);
    console.assert(x.sub(y).toString() === '-256');
    console.assert(y.add(x.neg()).toString() === '256');
    console.assert(x.mul(y).toString() == (-(128 ** 2)).toString());
    console.assert(y.div(x).neg().toString() === '1');
    console.assert(y.div(Int65.fromNumber(129)).toString() === '0');
    // check if size limits are enforced correctly
    // should work
    Int65.fromBigInt((1n << 64n) - 1n).add(Int65.zero);
    Int65.fromBigInt(-(1n << 64n) + 1n).add(Int65.zero);
    // should fail
    let fail = true;
    try {
        Int65.fromBigInt(1n << 64n);
        fail = false;
    }
    catch { }
    try {
        Int65.fromBigInt(-(1n << 64n));
        fail = false;
    }
    catch { }
    try {
        new Int65(Field((1n << 64n).toString()), Field(1)).add(Int65.zero);
        fail = false;
    }
    catch { }
    console.assert(fail === true);
    console.log('everything ok!');
}
