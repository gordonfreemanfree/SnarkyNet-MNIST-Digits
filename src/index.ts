import {
  UInt64,
  Field,
  shutdown,
  SmartContract,
  PublicKey,
  method,
  PrivateKey,
  Mina,
  state,
  State,
  isReady,
  Party,
  Bool,
  Circuit,
} from 'snarkyjs';
import { spawnSync } from 'child_process';
import { readFileSync } from 'fs';

class SnarkyNet {
  // SnarkyJS Implementation of the components for a Neural Network 
  x:                Array<Field>[]; // Inputs
  y:                Array<Field>[]; // Outputs
  weights:          Array<Field>[]; // Weights - TODO: This may be a good candidate for transfer learning
  hidden:           Array<Field>;   // Hidden Layer
  error:            Array<Field>;   // Error for the training cycle
  error_history:    Array<number>;  // Error History
  epoch_list:       Array<number>;  // Epoch List
  DECIMAL_POINTS:   number;         // Number of decimal points for representation

  constructor( x: Array<Field>[], y: Array<Field>[], weights: Array<Field>[] ) {
    this.DECIMAL_POINTS = 1 000 000 000 000 000; 
    this.x = x;                           // Inputs
    this.y = y;                           // Outputs
    this.weights = weights;               // Weights
    this.error_history = Array<number>(); // History of the error
    this.epoch_list = Array<number>();    // Epoch list
  }
  
  feed_forward( ) {
    //this.hidden = this.relu( this.dot_matrix( this.x, this.weights ) );
  }

  dot_matrix( m1: Array<Field>[][], m2: Array<Field>[][] ) {
    // perform a dot product on the two matricies
    // TODO perform size checking to verify the compatible sizes
    let result = Array(Array<Field>());
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2.length; i++) {
        result[ i ][ j ] = this.dot_vector( m1[ i ][ j ],  m2[ i ][ j ] ); // TODO: is this right?? Shouldn't I have to transpose the second array?
      }
    }
    return result;
  }

  dot_vector( v1: Array<Field>, v2: Array<Field> ) {
    // perform a dot product on the two field arrays v1 and v2
    // TODO perform length checking
    let result = Field.zero;
    for (let i = 0; i < v1.length; i++) {
        result.add( v1[ i ].mul( v2[ i ] ) );
      }
      return result;
  }

  // Activation Functions
  relu( x: Field ) {
    // relu implementation
    return Circuit.if( x.gt( 0 ), x, Field.zero );
  }

  leaky_relu( x: Field, alpha = 0.01 ) {
    // leaky relu implementation
    return Circuit.if( x.gt( 0 ), x, x.mul( alpha ) );
  }

  // TODO Sigmoid and Tanh activation functions

  @method train( ) {
    // feed forward
    this.feed_forward( )
  }
}

await isReady;

let inputs = [[Field(0), Field(1), Field(0)],
              [Field(0), Field(1), Field(1)],
              [Field(0), Field(0), Field(0)],
              [Field(1), Field(0), Field(0)],
              [Field(1), Field(1), Field(1)],
              [Field(1), Field(0), Field(1)]]

let outputs = [[Field(0)], [Field(0)], [Field(0)], [Field(1)], [Field(1)], [Field(1)]]

let weights = [[Field(1)], [Field(1)], [Field(1)]]

let model: SnarkyNet;

model = new SnarkyNet( inputs, outputs, weights );

shutdown();