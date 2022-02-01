
import { 
    prop, 
    CircuitValue, 
    Field, 
    UInt64, 
    UInt32, 
    Circuit, 
    Bool,
} from 'snarkyjs';

function argToField(name: string, x: { value: Field } | number): Field {
    if (typeof x === 'number') {
      if (!Number.isInteger(x)) {
        throw new Error(`${name} expected integer argument. Got ${x}`);
      }
      return new Field(x);;
    } else {
      return x.value;
    }
  }

  class Sgn extends CircuitValue {
    // +/- 1
    @prop value: Field;
  
    static check(x: Sgn) {
      let x_ = x.value.seal();
      x_.mul(x_).assertEquals(Field.one);
    }
  
    constructor(value: Field) {
      super();
      this.value = value;
    }
  
    static get Pos() {
      return new Sgn(Field.one);
    }
    static get Neg() {
      return new Sgn(Field.one.neg());
    }
  }

export class Int64 {
    // In the range [-2^63, 2^63 - 1]
    @prop value: Field;

    static NUM_BITS = 64;
  
    static check() {
      throw 'todo: int64 check';
    }
  
    /*
    @prop magnitude: UInt64 | null;
    @prop isPos: Sgn | null;
    */
  
    constructor(x: Field) {
      this.value = x;
    }
  
    toString(): string {
      const s = this.value.toString();
      const n = BigInt(s);
      if (n < 1n << 64n) {
        return s;
      } else {
        return '-' + this.value.neg().toString();
      }
    }
  
    static get zero(): Int64 {
      return new Int64(Field.zero);
    }
  
    static fromUnsigned(x: UInt64): Int64 {
      return new Int64(x.value);
    }
  
    private static shift(): Field {
      return Field.fromJSON((1n << 64n).toString()) as Field;
    }
  
    uint64Value(): Field {
      const n = BigInt(this.value.toString());
      if (n < 1n << 64n) {
        return this.value;
      } else {
        const x = this.value.add(Int64.shift());
  
        return x;
      }
    }
  
    static sizeInFields(): number {
      return 1;
    }
  
    neg(): Int64 {
      return new Int64(this.value.neg());
    }
  
    add(y: Int64 | UInt32 | UInt64) {
      return new Int64(this.value.add(y.value));
    }
  
    sub(y: Int64 | UInt32 | UInt64) {
      return new Int64(this.value.sub(y.value));
    }
  
    repr(): { magnitude: Field; isPos: Sgn } {
      throw 'repr';
    }
  
    static toFields(x: Int64): Field[] {
      return [x.value];
    }
  
    static ofFields(xs: Field[]) {
      return new Int64(xs[0]);
    }
  
    toFields(): Field[] {
      return Int64.toFields(this);
    }
  
    sizeInFields(): number {
      return Int64.sizeInFields();
    }
  
    divMod(y: Int64 | number): [Int64, Int64] {
      let x = this.value;
      let y_ = argToField('Int64.div', y);
  
      if (this.value.isConstant() && y_.isConstant()) {
        let xn = BigInt(x.toString());
        let yn = BigInt(y_.toString());
        let q = xn / yn;
        let r = xn - q * yn;
        return [
          new Int64(new Field(q.toString())),
          new Int64(new Field(r.toString())),
        ];
      }
  
      y_ = y_.seal();
  
      let q = Circuit.witness(
        Field,
        () => new Field((BigInt(x.toString()) / BigInt(y_.toString())).toString())
      );
  
      q.rangeCheckHelper(Int64.NUM_BITS).assertEquals(q);
  
      // TODO: Could be a bit more efficient
      let r = x.sub(q.mul(y_)).seal();
      r.rangeCheckHelper(Int64.NUM_BITS).assertEquals(r);
  
      let r_ = new Int64(r);
      let q_ = new Int64(q);
  
      r_.assertLt(new Int64(y_));
  
      return [q_, r_];
    }
    
    /** Integer division.
     *
     * `x.div(y)` returns the floor of `x / y`, that is, the greatest
     * `z` such that `x * y <= x`.
     *
     */
     div(y: Int64 | number): Int64 {
      return this.divMod(y)[0];
    }
  
    /** Integer remainder.
     *
     * `x.mod(y)` returns the value `z` such that `0 <= z < y` and
     * `x - z` is divisble by `y`.
     */
    mod(y: Int64 | number): Int64 {
      return this.divMod(y)[1];
    }
  
    /** Multiplication with overflow checking.
     */
    mul(y: Int64 | number): Int64 {
      let z = this.value.mul(argToField('Int64.mul', y));
      z.rangeCheckHelper(Int64.NUM_BITS).assertEquals(z);
      return new Int64(z);
    }
  
    lte(y: Int64): Bool {
      let xMinusY = this.value.sub(argToField('Int64.lte', y)).seal();
      let xMinusYFits = xMinusY.rangeCheckHelper(Int64.NUM_BITS).equals(xMinusY);
      let yMinusXFits = xMinusY
        .rangeCheckHelper(Int64.NUM_BITS)
        .equals(xMinusY.neg());
      xMinusYFits.or(yMinusXFits).assertEquals(true);
      // x <= y if y - x fits in 64 bits
      return yMinusXFits;
    }
  
    assertLte(y: Int64) {
      let yMinusX = argToField('Int64.lt', y).sub(this.value).seal();
      yMinusX.rangeCheckHelper(Int64.NUM_BITS).assertEquals(yMinusX);
    }
  
    lt(y: Int64): Bool {
      return this.lte(y).and(this.value.equals(y.value).not());
    }
  
    assertLt(y: Int64) {
      this.lt(y).assertEquals(true);
    }
  
    gt(y: Int64): Bool {
      return y.lt(this);
    }
  
    assertGt(y: Int64) {
      y.assertLt(this);
    }
  }
  