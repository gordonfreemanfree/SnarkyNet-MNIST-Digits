// Description: SnarkyNet and SnarkyLayers allow for the implementation of a SnarkyJS 
// version of a Deep Neural Network. 
// SnarkyLayers are defined to represent the Dense Neural Network layers combined in 
// SnarkyNet for prediction.

export { SnarkyLayer, SnarkyNet };

import {
  Field,
  method,
  Circuit,
  Bool,
} from 'snarkyjs';

import { SnarkyTensor } from './snarkytensor.js'

// create a callable layer
// TODO - Make it callable 
class SnarkyLayer extends SnarkyTensor {
  weights:    Array<Field>[];       // weights
  bias:       Array<Field>;         // bias
  activation: Function;             // activation function
  alpha:      Field;                // alpha value for leaky relu
  decimal:    number;               // multiplier for decimals

  constructor( weights: Array<number>[], activation='relu', alpha=0.01 ) {
  super()    

    // Activation Function 
    this.activation = this.activation_selection( activation );

    // Set alpha
    this.alpha = this.num2field( alpha );

    // Weights
    this.weights = this.num2field_t2( weights );
  }
  
  @method call( input:  Array<Field>[] ): Array<Field>[] {
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
  activation_t2( x: Array<Field>[] ): Array<Field>[] {
    // Applying activation functions for a rank 2 tensor
    let result = Array();
    x.forEach( ( value, index ) => 
      result[ index ] = this.activation( value )
    );
    return result;
  }

  // Activation Functions (implemented for rank 1 tensors)
  relu_t1( x: Array<Field> ): Array<Field> {
    // RelU implementation for an Array
    // Equivalent: result = max( x, 0 )
    let result = Array<Field>();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.gt( 0 ), value, Field.zero ) 
    );
    return result;
  }

  relu_leaky_t1( x: Array<Field> ): Array<Field> {
    // Leaky RelU implementation for an Array
    let result = Array<Field>();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.gt( 0 ), value, value.mul( this.alpha ) ) 
    );
    return result;
  }

  softmax_t1( x: Array<Field> ): Array<Field> {
    // Softmax Implementation for an Array
    // Equivalent: result = exp(x) / / ( exp(x1) + .. + exp(xn) )
    // TODO - implement with exp
    return this.softmax_pseudo_t1( x );
  }

  softmax_pseudo_t1( x: Array<Field> ): Array<Field> {
    // Pseudo Softmax Implementation for an Array
    // Equivalent: result = x / ( x1 + .. + xn )
    let sum = Field.zero;
    x.forEach( value => sum = sum.add( value ) );

    let result = Array<Field>();
    x.forEach( ( value, i ) => 
      result[ i ] = value.div( sum )
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

  @method predict( inputs: Array<number>[] ): Array<Bool> {
    // Prediction method to run the model
    // Step 1. Convert initial inputs to a 
    let x = this.num2field_t2( inputs ); 
    
    // Step 2. Call the SnarkyLayers
    this.layers.forEach( ( layer ) => 
      x = layer.call( x )
    ); 

    // Step 3. Return an array of Bool
    // Assume only one image is processed at a time
    return this.parse_classes( x[ 0 ] ) ;
  }

  parse_classes( x: Array<Field> ) {
    // Return an array of Bool for the max class
    // TODO do this better
    // TODO add threshold? 
    
    // Step 1. Find the maximum classification
    let max = Field.zero;
    x.forEach( ( value ) => 
      max = Circuit.if( value.gte( max ), value, max )
    ); 

    // Step 2. Create the Bool array for the classes
    // True if it is the max value, False otherwise
    let result = Array<Bool>();
    x.forEach( ( value, index ) =>
      result[ index ] = Circuit.if( value.gte( max ), Bool( true ), Bool( false ) )
    )
    return result;
  }
}
