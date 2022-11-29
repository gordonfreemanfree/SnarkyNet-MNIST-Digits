import {
  isReady,
  Mina,
  PrivateKey,
  PublicKey,
  UInt64,
  fetchAccount,
  shutdown,
} from 'snarkyjs';
import { SmartSnarkyNet } from './smart_snarkynet.js';
import { SnarkyLayer, SnarkyNet } from './snarkynet.js';
import { weights_l1, weights_l2 } from './assets/weights.js';
import {
  image_a_7,
  image_b_2,
  image_c_1,
  image_d_0,
  image_e_4,
  image_f_1,
  image_g_4,
  image_h_9,
  image_i_5,
  image_j_9,
} from './assets/example_images.js';
import { deploy } from './utils/deploy.js';
import { makeAndSendTransaction } from './utils/utils.js';
import { Int65 } from './Int65_v4.js';

export async function runSnarkNet() {
  // Wait for it to be ready
  await isReady;

  // get current time
  let startTime = new Date().getTime() / 1000;
  console.log('Ready');

  // Local instance of Mina
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // create two accounts
  const account1 = Local.testAccounts[0].privateKey;
  const account2 = Local.testAccounts[1].privateKey;

  const zkappPrivkey = PrivateKey.fromBase58(
    'EKEksspc7D7suPXs8rPf7Lb9h6NVk3j4QFeU6ufQnDg5cU8dGSsw'
  );
  const zkappPubkey = zkappPrivkey.toPublicKey();
  console.log('zkappPubkey', zkappPubkey.toBase58());
  let transactionFee = 100_000_000;

  // weights for the model
  console.log('Create Layers', new Date().getTime() / 1000 - startTime);
  let layers = [
    new SnarkyLayer(weights_l1, 'relu'),
    new SnarkyLayer(weights_l2, 'softmax'),
  ];

  // create an instance of the model
  console.log('Create SNAPP Instance', new Date().getTime() / 1000 - startTime);

  let snappInstance: SmartSnarkyNet;

  // // Deploys the snapp
  console.log('Deploy the SNAPP', new Date().getTime() / 1000 - startTime);
  // await Mina.transaction(account1, async () => {
  //   // account2 sends 1000000000 to the new snapp account
  //   const amount = UInt64.from(1000000000);
  //   const p = await AccountUpdate.createSigned(account2);
  //   p.balance.subInPlace(amount);

  //   // deploy the SNAPP with the weights
  //   console.log('Deploy SnarkyNet', new Date().getTime() / 1000 - startTime);
  //   snappInstance = new SmartSnarkyNet(
  //     amount,
  //     snappPubkey,
  //     new SnarkyNet(layers)
  //   );
  // })
  //   .send()
  //   .wait();
  console.log('Compiling smart contract...');
  let { verificationKey } = await SmartSnarkyNet.compile();

  let zkapp = new SmartSnarkyNet(
    new UInt64(1000000000),
    zkappPubkey,
    new SnarkyNet(layers)
  );

  await deploy(
    // deployerPrivateKey,
    account1,
    // zkAppPrivateKey,
    zkappPrivkey,
    // zkAppPublicKey,
    zkappPubkey,
    // zkapp,
    zkapp,
    verificationKey
  );

  //////////////////////////////// Test 1 ////////////////////////////////
  console.log(
    'Test 1 - Start: Run prediction on image_4:',
    new Date().getTime() / 1000 - startTime
  );

  await makeAndSendTransaction({
    feePayerPrivateKey: zkappPrivkey,
    zkAppPublicKey: zkappPubkey,
    mutateZkApp: () => zkapp.predict([image_a_7]),
    transactionFee: transactionFee,
    getState: () => zkapp.state.get(),
    statesEqual: (num1, num2) => num1.equals(num2).toBoolean(),
  });

  // await Mina.transaction(account1, async () => {
  //   await snappInstance.predict([image_a_7]);
  // })
  //   .send()
  //   .wait()
  //   .catch((e) => console.log(e));
  console.log('Test 1 - End', new Date().getTime() / 1000 - startTime);
  // const a = await Mina.getAccount(snappPubkey);
  // // console.log('Class State:', a.snapp.appState[0].toString());

  await fetchAccount({ publicKey: zkappPubkey });
  let state = await zkapp.state.get();
  console.log('Class State after the update:', state.toString());
  // Shutdown
  shutdown();
}

export async function createModel() {
  let layers = [
    new SnarkyLayer(weights_l1, 'relu'),
    new SnarkyLayer(weights_l2, 'softmax'),
  ];
  console.log(layers);
}

console.log('Start');
// await runSnarkNet();
await createModel();

console.log('End');
