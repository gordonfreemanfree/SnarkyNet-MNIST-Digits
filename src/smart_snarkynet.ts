// Description: Smart Contract utilizing SnarkyNet and SnarkyLayers for an implmenetation of a Deep Neural Network
// for the MNIST Handwritten Digits Dataset: http://yann.lecun.com/exdb/mnist/

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
} from 'snarkyjs';

// Import Layer Weights
import { weights_l1, weights_l2 } from './weights.js';

// Import Example Images
import { image_4 } from './example_images.js';

// Import SnarkyNet and SnarkyLayers
import { SnarkyNet, SnarkyLayer } from './snarkynet.js'

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
  console.log( 'Test 1 - Start: Run prediction on image_4. Expected state of 64' );
  await Mina.transaction( account1, async () => {
    await snappInstance.predict( [ image_4 ] );
    })
    .send()
    .wait()
    .catch((e) => console.log(e));
  console.log( 'Test 1 - End.' );
  const a = await Mina.getAccount(snappPubkey);
  console.log('Class State:', a.snapp.appState[0].toString());


  // Shutdown
  shutdown();
}

runSnarkNet();