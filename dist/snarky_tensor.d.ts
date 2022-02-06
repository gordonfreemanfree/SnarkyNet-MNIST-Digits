export { SnarkyTensor };
import { Int65 } from './Int65.js';
declare class SnarkyTensor {
    decimal_multiplier: number;
    decimal_multiplier_int65: Int65;
    constructor(power?: number);
    dot_product_t2(m1: Array<Int65>[], m2: Array<Int65>[]): Array<Int65>[];
    dot_product_t1(v1: Array<Int65>, v2: Array<Int65>): Int65;
    transpose(x: Array<Int65>[]): Array<Int65>[];
    exp(x: Int65): Int65;
    num2float_t2(x: Array<number>[]): Array<Int65>[];
    num2float_t1(x: Array<number>): Array<Int65>;
    num2float(x: number): Int65;
}
