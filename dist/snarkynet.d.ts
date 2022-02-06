export { SnarkyLayer, SnarkyNet };
import { Bool, Field } from 'snarkyjs';
import { SnarkyTensor } from './snarky_tensor.js';
import { Int65 } from './Int65.js';
declare class SnarkyLayer extends SnarkyTensor {
    weights: Array<Int65>[];
    activation: Function;
    alpha: Int65;
    decimal: number;
    zero: Int65;
    constructor(weights: Array<number>[], activation?: string, alpha?: number);
    call(input: Array<Int65>[]): Array<Int65>[];
    activation_selection(activation: string): Function;
    activation_t2(x: Array<Int65>[]): Array<Int65>[];
    relu_t1(x: Array<Int65>): Array<Int65>;
    relu_leaky_t1(x: Array<Int65>): Array<Field>;
    softmax_t1(x: Array<Field>): Array<Field>;
    softmax_pseudo_t1(x: Array<Field>): Array<Field>;
}
declare class SnarkyNet extends SnarkyTensor {
    layers: Array<SnarkyLayer>;
    constructor(layers: Array<SnarkyLayer>);
    predict(inputs: Array<number>[]): Int65;
    parse_classes(x: Array<Field>): Bool[];
}
