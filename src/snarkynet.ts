// Description: SnarkyNet and SnarkyLayers allow for the implementation of a SnarkyJS 
// version of a Deep Neural Network. 
// SnarkyLayers are defined to represent the Dense Neural Network layers combined in 
// SnarkyNet for prediction.

export { SnarkyLayer, SnarkyNet };

import {
  method,
  Circuit,
  Bool,
  Field,
} from 'snarkyjs';

import { SnarkyTensor } from './snarky_tensor.js'
import { Int65 } from './Int65.js';

// create a layer
class SnarkyLayer extends SnarkyTensor {
  weights:    Array<Int65>[];      // weights
  activation: Function;             // activation function
  alpha:      Int65;               // alpha value for leaky relu
  decimal:    number;               // multiplier for decimals
  zero:       Int65;               // zero

  constructor( weights: Array<number>[], activation='relu', alpha=0.01 ) {
  super()    

    // Activation Function 
    this.activation = this.activation_selection( activation );

    // Set alpha
    this.alpha = this.num2int65( alpha );

    // Weights
    this.weights = this.num2int65_t2( weights );
  }
  
  @method call( input:  Array<Int65>[] ): Array<Int65>[] {
    // Dense layer implementation
    // Equivalent: output = activation( dot( input, weight ) )
    return this.activation_t2( this.dot_product_t2( input, this.weights ) );
  }

  // Select Activation Function
  activation_selection( activation: string ): Function {
    // Select the activation function
    if ( activation == 'relu' )            { return this.relu_t1 }        // RelU Activation Function         
    else if ( activation == 'relu_leaky' ) { return this.relu_leaky_t1 }  // Leaky RelU Activation Function
    else if ( activation == 'softmax' )    { return this.softmax_t1 }     // Softmax Activation Function
    else { throw Error( 'Activation Function Not Valid' ) }               // Invalid Activation Function
  }

  // Activation 
  activation_t2( x: Array<Int65>[] ): Array<Int65>[] {
    // Applying activation functions for a rank 2 tensor
    let result = Array();
    x.forEach( ( value, index ) => 
      result[ index ] = this.activation( value )
    );
    return result;
  }

  // Activation Functions (implemented for rank 1 tensors)
  relu_t1( x: Array<Int65> ): Array<Int65> {
    // RelU implementation for an Array
    // Equivalent: result = max( x, 0 )
    let result = Array();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.sign.equals(Field.one).toBoolean(), value, Int65.zero )
    );
    return result;
  }

  relu_leaky_t1( x: Array<Int65> ): Array<Field> {
    // Leaky RelU implementation for an Array
    let result = Array();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.sign.equals(Field.one).toBoolean(), value, value.mul( this.alpha ) )
    );
    return result;
  }

  softmax_t1( x: Array<Int65> ): Array<Int65> {
    // Softmax Implementation for an Array
    let sum = Int65.zero;
    let result = Array<Int65>();
    // Equivalent: result = x / ( x1 + .. + xn )
    x.forEach( value => console.log( this.exp( value ).toString() ) );
    // result returned as percentage
    x.forEach( value => sum = sum.add( this.exp( value ) ) );
    x.forEach( ( value, i ) => 
      result[ i ] = this.exp( value ).div( sum ).mul( Int65.fromNumber( Math.pow( 10, 2 ) ) )
    );
    return result;
  }
}

class SnarkyNet extends SnarkyTensor {
  layers: Array<SnarkyLayer>;         // Array of SnarkyLayer

  constructor( layers: Array<SnarkyLayer> ) {
    super()

    // SnarkyLayers
    this.layers = layers;             // SnarkyJS Layers
  }

  @method predict( inputs: Array<number>[] ): Int65 {
    // Prediction method to run the model
    // Step 1. Convert initial inputs to a float
    let x = this.num2int65_t2( inputs ); 
    
    // Step 2. Call the SnarkyLayers
    this.layers.forEach( ( layer ) => 
      x = layer.call( x )
    ); 

    // Step 3. Parse Classes
    this.parse_classes( x[0] )
    return Int65.zero
  }

  parse_classes( x: Array<Int65> ): Array<Bool> {
    // Return an array of Bool if it exceeds the threshold
    let output = Array<Bool>();

    // determine if values exceed the threshold
    let max = Int65.fromNumber( 90 );
    console.log( ' - Results - ' )
    for (let i = 0; i < x.length; i++) {
      console.log( 'Classification of', i, ': ', x[i].toString(), '%' )
      let delta = x[i].sub( max );
      output[i] = Circuit.if( delta.sign.equals(Field.one).toBoolean(), Bool(true), Bool(false) )
    }
    return output;
  }
}
