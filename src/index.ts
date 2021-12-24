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
  activation: string;               // activation function - TODO save it as a method?

  constructor( weights: Array<number>[], activation='relu' ) {
    
    // Activation Function
    this.activation = activation;

    // Weights
    this.weights = num2field( weights );

    // Bias
    // this.bias = Array(output_size).fill( Array( Field.zero ) )
    // this.bias = this.num2field( bias );
  }
  
  @method call( input:  Array<Field>[] ):  Array<Field>[] {
    // Simple dense layer implementation
    // TODO make this callable
    // TODO implement bias
    return this.activation_matrix( this.dot_product( input, this.weights ) );
  }

  // Dot Product
  dot_product( m1: Array<Field>[], m2: Array<Field>[] ): Array<Field>[] {
    // perform a dot product on the two matricies
    //TODO verify this works a matrix for weights
    function dot_product_array( v1: Array<Field>, v2: Array<Field> ): Field {
      // perform a dot product on the two field arrays v1 and v2
      let result = Field.zero;
      for ( let i = 0; i < v1.length; i++ ) { 
        result = result.add( v1[ i ].mul( v2[ i ] ) ) 
      }
      return result;
    }
    let result = Array();
    let m2_t = transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < m2_t.length; j++ ) {
        m_array[ j ]= dot_product_array( m1[ i ],  m2_t[ j ] ); 
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
      result[ index ] = this.activation_array( value )
    );
    return result;
  }

  activation_array( x: Array<Field> ): Array<Field> {
    // Applying activation functions for an array
    let result = Array<Field>();

    // Necessary for the Pseudo Softmax
    let sum = Field.zero;
    x.forEach( value => sum = sum.add( value ) );

    for ( let i = 0; i < x.length; i++ ) {
      if ( this.activation == 'relu' ) {
        // RelU Activation Function
        result[ i ] = this.relu( x[ i ] );
      } else if ( this.activation == 'relu_leaky' ) {
        // Leaky RelU Activation Function
        result[ i ] = this.relu_leaky( x[ i ] );
      } else if ( this.activation == 'softmax_pseudo' )
        // Pseudo Softmax Activation Function
        // TODO: Use exp for true softmax implementation
        result[ i ] = this.softmax_pseudo( x[ i ], sum )
    }
    return result;
  }

  // Activation Functions
  relu( x: Field ): Field {
    // RelU implementation
    return Circuit.if( x.gt( 0 ), x, Field.zero );
  }

  relu_leaky( x: Field, alpha = 0.01 ): Field {
    // Leaky RelU implementation
    return Circuit.if( x.gt( 0 ), x, x.mul( alpha ) );
  }

  softmax_pseudo( x: Field, sum: Field ): Field {
    // Pseudo Softmax Implementation
    return x.div( sum );
  }
}


class SnarkyNet {
  layers: Array<SnarkyLayer>;         // Array of SnarkyLayer

  constructor( layers: Array<SnarkyLayer> ) {
    // SnarkyLayers
    this.layers = layers;             // SnarkyJS Layers
  }

  @method predict( inputs: Array<Field>[] ): Array<Field>[] {
    // Prediction method to run the model
    // Save initial inputs
    let x = inputs; 
    // Call the SnarkyLayers
    this.layers.forEach( ( layer ) => x = layer.call( x ) )
    return x;
  }
}


// Conversion from numbers to fields
function num2field( x: Array<number>[] ) {
  // Convert matrix of numbers to maxtrix of fields
  function num2field_array( x: Array<number> ) {
    // Convert array of numbers to array of fields
    let result = Array<Field>();
    x.forEach( ( value, index ) => result[ index ] = Field( value ) )
    return result;
  }
  let result = Array();
  x.forEach( ( value, index ) => result[ index ] = num2field_array( value ) )
  return result
}

// Transpose
function transpose( x: Array<Field>[] ) {
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
    const prediction = this.model.predict( num2field( input ) );
    console.log( prediction[0] );

    console.log( transpose( prediction ) );

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
  let layers = [ new SnarkyLayer( [[0, 1], [1, 1], [1, 0]], 'relu' ) ];

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
    await snappInstance.predict( [ [ 1, 1, 0 ] ] );
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