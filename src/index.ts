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
} from 'snarkyjs';

// create a callable layer
// TODO - Make it callable 
class SnarkyLayer {
  weights:    Array<Field>[];       // weights
  bias:       Array<Field>;         // bias
  activation: Function;             // activation function
  alpha:      number;               // alpha value for leaky relu
  decimal:    number;               // multiplier for decimals

  constructor( weights: Array<number>[], activation='relu', alpha=0.01 ) {
    
    // Multiplier for representing decimals
    this.decimal = 1;

    // Activation Function Selection
    this.activation_selection( activation );

    // Set alpha
    this.alpha = Math.round( alpha * this.decimal );

    // Weights
    this.weights = this.num2field( weights );

    // Bias - TODO 
    // this.bias = Array(output_size).fill( Array( Field.zero ) )
    // this.bias = this.num2field( bias );
  }
  
  @method call( input:  Array<Field>[] ): Array<Field>[] {
    // Dense layer implementation
    // Equivalent: output = activation( dot( input, weight ) + bias )
    // TODO make this callable
    // TODO implement bias
    return this.activation_matrix( this.dot_product( input, this.weights ) );
  }

  // Select Activation Function
  activation_selection( activation: string ): void {
    // Select the activation function
    if ( activation == 'relu' )            { this.activation = this.relu }        // RelU Activation Function         
    else if ( activation == 'relu_leaky' ) { this.activation = this.relu_leaky }  // Leaky RelU Activation Function
    else if ( activation == 'softmax' )    { this.activation = this.softmax }     // Softmax Activation Function
    else { throw Error( 'Activation Function Not Valid' ) }                       // Invalid Activation Function
  }

  // Dot Product
  dot_product( m1: Array<Field>[], m2: Array<Field>[] ): Array<Field>[] {
    // Perform a dot product on the two matricies
    // TODO verify this works a matrix for weights
    function dot_array( v1: Array<Field>, v2: Array<Field> ): Field {
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
        m_array[ j ]= dot_array( m1[ i ],  m2_t[ j ] ); 
      }
      result[ i ] = m_array;
    }
    return result;
  }

  // Activation Matrix 
  activation_matrix( x: Array<Field>[] ): Array<Field>[] {
    // Applying activation functions for a matrix
    let result = Array();
    x.forEach( ( value, index ) => 
      result[ index ] = this.activation( value )
    );
    return result;
  }

  // Activation Functions (Implemented for Arrays)
  relu( x: Array<Field> ): Array<Field> {
    // RelU implementation for an Array
    // Equivalent: result = max( x, 0 )
    let result = Array<Field>();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.gt( 0 ), value, Field.zero ) 
    );
    return result;
  }

  relu_leaky( x: Array<Field> ): Array<Field> {
    // Leaky RelU implementation for an Array
    let result = Array<Field>();
    x.forEach( ( value, i ) => 
      result[ i ] = Circuit.if( value.gt( 0 ), value, value.mul( this.alpha ) ) 
    );
    return result;
  }

  softmax( x: Array<Field> ): Array<Field> {
    // Softmax Implementation for an Array
    // Equivalent: result = exp(x) / / ( exp(x1) + .. + exp(xn) )
    // TODO - implement with exp
    return this.softmax_pseudo( x );
  }

  softmax_pseudo( x: Array<Field> ): Array<Field> {
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
  transpose( x: Array<Field>[] ) {
    // Transpose the matrix
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
  @method num2field( x: Array<number>[] ) {
  function num2field_array( x: Array<number>, decimal_multiplier: number ) {
    // Convert array of numbers to array of fields
    let result = Array<Field>();
    // Multiple the number by the decimal multiplier and round before converting to Field
    x.forEach( ( value, index ) => 
      result[ index ] = Field( Math.round( value * decimal_multiplier ) )
    )
    return result;
  }
  // Convert matrix of numbers to maxtrix of fields
  let result = Array();
  x.forEach( ( value, index ) => 
    result[ index ] = num2field_array( value, this.decimal )
  )
  return result
}

}

class SnarkyNet {
  layers: Array<SnarkyLayer>;         // Array of SnarkyLayer

  constructor( layers: Array<SnarkyLayer> ) {
    // SnarkyLayers
    this.layers = layers;             // SnarkyJS Layers
  }

  @method predict( inputs: Array<number>[] ): Array<Field>[] {
    // Prediction method to run the model
    // Save initial inputs
    let x = this.layers[0].num2field( inputs ); 
    
    // Call the SnarkyLayers
    this.layers.forEach( ( layer ) => 
      x = layer.call( x )
    ); 
    return x;
  }
}

class SmartSnarkyNet extends SmartContract {
  // Field State of 80 bit representation
  @state(Field) state: State<Field>;  // stored state
  model: SnarkyNet;                   // model object
  reward_balance: UInt64;             // balance for the reward

  constructor(initialBalance: UInt64, address: PublicKey, init_state: Field, model: SnarkyNet) {
    super(address);
    // intial balance for the reward
    this.reward_balance = initialBalance;
    this.balance.addInPlace( this.reward_balance );

    // set the initial values
    this.state = State.init(init_state);
    this.model = model;
  }

  @method async predict( input: Array<number>[] ) {
    // run the model and obtain the predictions
    const prediction = await this.model.predict( input );
    console.log( prediction );

    prediction.forEach( ( value, index ) => 
      value.forEach( data => 
        console.log( data )
        
      )
      );
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
  let layers = [  new SnarkyLayer( [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'relu' ) ];

  // create an instance of the model
  let snappInstance: SmartSnarkyNet;

  // Deploys the snapp
  await Mina.transaction(account1, async () => {
    // account2 sends 1000000000 to the new snapp account
    const amount = UInt64.fromNumber(1000000000);
    const p = await Party.createSigned(account2);
    p.balance.subInPlace(amount);
    // deploy the SNAPP with the weights
    snappInstance = new SmartSnarkyNet(amount, snappPubkey, Field.zero, new SnarkyNet( layers ) );
  })
    .send()
    .wait();

//////////////////////////////// Test 1 ////////////////////////////////
  console.log( 'Test 1 - Start:' );
  await Mina.transaction( account1, async () => {
    await snappInstance.predict( [  [ 511, 512, 513 ] ] );
    })
    .send()
    .wait()
    .catch((e) => console.log(' Test 1 Failed.'));
  console.log( 'Test 1 - End.' );
  const a = await Mina.getAccount(snappPubkey);
  console.log('State value:', a.snapp.appState[0].toString());

  // Shutdown
  shutdown();
}

runSnarkNet();