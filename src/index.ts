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
  weights:          Array<Field>[]; // Weights
  hidden:           Array<Field>[]; // Hidden Layer
  error:            Array<Field>;   // Error for the training cycle
  error_history:    Array<number>;  // Error History
  epoch_list:       Array<number>;  // Epoch List
  DECIMAL_POINTS:   number;         // Number of decimal points for representation

  constructor( x: Array<number>[], y: Array<number>[], weights: Array<number>[] ) {
    this.DECIMAL_POINTS = 1;                    // Decimal points
    this.x = this.num2field_matrix( x );              // Inputs
    this.y = this.num2field_matrix( y );              // Outputs
    this.weights = this.num2field_matrix( weights );  // Weights
    this.error_history = Array<number>();             // History of the error
    this.epoch_list = Array<number>();                // Epoch list

    // feed forward
    this.feed_forward();
    let test = new Field( 0 )
    test.add( new Field( 0 ) )
    console.log( test.add( Field( 1 ).mul( Field( 1 ) ) ) )
  }
  
  num2field_matrix( x: Array<number>[] ) {
    // Convert matrix of numbers to maxtrix of fields
    let result = Array();
    for (let i = 0; i < x.length; i++) {
      result[i] = this.num2field_array( x[i] )
    }
    return result
  }

  num2field_array( x: Array<number> ) {
    // Convert array of numbers to array of fields
    let result = Array<Field>();
    for (let i = 0; i < x.length; i++) {
      result[i] = Field( Math.round( x[i] * this.DECIMAL_POINTS ) );
    }
    return result;
  }

  transpose_n( x: Array<number>[] ) {
    // Transpose the matrix
    let result = Array();
    let m_length = x[0].length
    let n_length = x.length
    for (let i = 0; i < m_length; i++) {
      let m_array = Array<number>();
      for (let j = 0; j < n_length; j++) {
        m_array[j] = x[ j ][ i ]; 
      }
      result[i] = m_array;
    }
    return result;
  }

  transpose_f( x: Array<Field>[] ) {
    // Transpose the matrix
    let result = Array();
    let m_length = x[0].length
    let n_length = x.length
    for (let i = 0; i < m_length; i++) {
      let m_array = Array<Field>();
      for (let j = 0; j < n_length; j++) {
        m_array[j] = x[ j ][ i ]; 
      }
      result[i] = m_array;
    }
    return result;
  }

  feed_forward( ) {
    // this.hidden = this.relu( this.dot_matrix( this.x, this.weights ) );

    //this.hidden = this.dot_matrix( this.x, this.weights );
    this.dot_matrix( this.x, this.weights );
  }

  dot_matrix( m1: Array<Field>[], m2: Array<Field>[] ) {
    // perform a dot product on the two matricies
    let result = Array<Field>();
    let m2_t = this.transpose_f( m2 );
    console.log( m1 )
    for (let i = 0; i < m1.length; i++) {
      // m_array = = Array<Field>
      for (let j = 0; j < m2_t.length; j++) {
        result[ i ] = this.dot_vector( m1[ i ],  m2_t[ j ] );
      }
      break;
    }
    return result;
  }

  dot_vector( v1: Array<Field>, v2: Array<Field> ) {
    // perform a dot product on the two field arrays v1 and v2
    let result = Field(0);
    for (let i = 0; i < v1.length; i++) {
        result.add( v1[ i ].mul( v2[ i ] ) );
        console.log( 'V1: ', v1[ i ] );
        console.log( 'V2: ', v2[ i ] );
        console.log( 'Mult: ', v1[ i ].mul( v2[ i ] ) );
        console.log( 'Result: ', result );
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

// Wait for it to be ready
await isReady;

// Input in the form of an array of array of numbers, aka matrix
// This will be converted to a matrix of fields

let inputs = [[0, 1, 0],
              [0, 1, 1],
              [0, 0, 0],
              [1, 0, 0],
              [1, 1, 1],
              [1, 0, 1]]

// Outputs
let outputs = [[0], [0], [0], [1], [1], [1]]

// Initial Weights
let weights = [[1], [1], [1]]

// Create the model
let model: SnarkyNet;

// Run the model
model = new SnarkyNet( inputs, outputs, weights );

// Shutdown
shutdown();