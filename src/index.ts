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
  Circuit,
  Bool,
} from 'snarkyjs';

// Import Layer Weights
import { weights_l1, weights_l2 } from './weights.js';

// Import Example Images
import { image_4 } from './example_images.js';

// create a callable layer
// TODO - Make it callable 
class SnarkyLayer {
  weights:    Array<Field>[];       // weights
  bias:       Array<Field>;         // bias
  activation: Function;             // activation function
  alpha:      Field;                // alpha value for leaky relu
  decimal:    number;               // multiplier for decimals

  constructor( weights: Array<number>[], activation='relu', alpha=0.01 ) {
    
    // Multiplier for representing decimals
    this.decimal = 1000000000;

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

  // Dot Product
  dot_product_t2( m1: Array<Field>[], m2: Array<Field>[] ): Array<Field>[] {
    // Perform a dot product on the two rank 2 tensors
    function dot_t1( v1: Array<Field>, v2: Array<Field> ): Field {
      // perform a dot product on the two field arrays v1 and v2
      let result = Field.zero;
      v1.forEach( ( v1_value, i ) => 
        result = result.add( v1_value.mul( v2[ i ] ) ) 
      );
      return result;
    }
    let result = Array();
    let m2_t = this.transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < m2_t.length; j++ ) {
        m_array[ j ]= dot_t1( m1[ i ],  m2_t[ j ] ); 
      }
      result[ i ] = m_array;
    }
    return result;
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

  // Math Helpers
  exp( x: Field ): Field {
    // Expotential Implementation
    // Field representation of e
    let e = this.num2field( 2.71828 )
    // TODO - need to determine how to do a power to a decimal?
    return x
  }

  // Matrix / Tensor Helpers
  transpose( x: Array<Field>[] ): Array<Field>[] {
    // Transpose the rank 2 tensor
    let result = Array();
    for ( let i = 0; i < x[0].length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < x.length; j++ ) {
        m_array[ j ] = x[ j ][ i ]; 
      }
      result[ i ] = m_array;
    }
    return result;
  }

  // Conversion from numbers to fields
  num2field_t2( x: Array<number>[] ): Array<Field>[] {
    // Convert rank 2 tensor of numbers to rank 2 tensor of fields
    let result = Array();
    x.forEach( ( value, index ) => 
      result[ index ] = this.num2field_t1( value )
    )
    return result
  }

  num2field_t1( x: Array<number> ): Array<Field> {
    // Convert array of numbers to array of fields
    let result = Array<Field>();
    x.forEach( ( value, index ) => 
      result[ index ] = this.num2field( value )
    )
    return result;
  }

  num2field( x: number ): Field {
    // Obtain a Field representation of the value
    return Field( Math.round( x * this.decimal ) ).div( this.decimal )
  }
}

class SnarkyNet {
  layers: Array<SnarkyLayer>;         // Array of SnarkyLayer

  constructor( layers: Array<SnarkyLayer> ) {
    // SnarkyLayers
    this.layers = layers;             // SnarkyJS Layers
  }

  @method predict( inputs: Array<number>[] ): Array<Bool> {
    // Prediction method to run the model
    // Step 1. Convert initial inputs to a 
    let x = this.layers[0].num2field_t2( inputs ); 
    
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

class SmartSnarkyNet extends SmartContract {
  // Field State to store the classification
  @state(Field) state: State<Field>;  // stored state for classification 

  model: SnarkyNet;                   // model object
  reward_balance: UInt64;             // balance for the reward

  constructor(initialBalance: UInt64, address: PublicKey, model: SnarkyNet) {
    super(address);
    // intial balance for the reward
    this.reward_balance = initialBalance;
    this.balance.addInPlace( this.reward_balance );

    // set the initial values
    this.state = State.init( Field.zero );

    // set the model
    this.model = model;
  }

  @method async predict( input: Array<number>[] ) {
    // run the model and obtain the predictions
    const prediction = await this.model.predict( input );
    this.state.set( Field.ofBits( prediction ) );
  }
}

export async function runSnarkNet() {
  // Wait for it to be ready
  await isReady;

  // Local instance of Mina
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // create two accounts
  const account1 = Local.testAccounts[0].privateKey;
  const account2 = Local.testAccounts[1].privateKey;

  const snappPrivkey = PrivateKey.random();
  const snappPubkey = snappPrivkey.toPublicKey();

  // weights for the model
  let layers = [  new SnarkyLayer( weights_l1, 'relu' ),
                  new SnarkyLayer( weights_l2, 'softmax' ) ];

  // create an instance of the model
  let snappInstance: SmartSnarkyNet;

  // Deploys the snapp
  await Mina.transaction(account1, async () => {
    // account2 sends 1000000000 to the new snapp account
    const amount = UInt64.fromNumber(1000000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(amount);

    // deploy the SNAPP with the weights
    snappInstance = new SmartSnarkyNet(amount, snappPubkey, new SnarkyNet( layers ) );
  })
    .send()
    .wait();

//////////////////////////////// Test 1 ////////////////////////////////
  console.log( 'Test 1 - Start:' );
  await Mina.transaction( account1, async () => {
    await snappInstance.predict( [ image_4 ] );
    })
    .send()
    .wait()
    .catch((e) => console.log(' Test 1 Failed.'));
  console.log( 'Test 1 - End.' );
  const a = await Mina.getAccount(snappPubkey);
  console.log('Class State:', a.snapp.appState[0].toString());


  // Shutdown
  shutdown();
}

runSnarkNet();