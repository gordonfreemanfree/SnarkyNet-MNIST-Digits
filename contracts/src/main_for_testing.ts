import { isReady } from 'snarkyjs';
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

import {
  image_0_label_7,
  image_1_label_2,
  image_2_label_1,
  image_3_label_0,
  image_4_label_4,
  image_5_label_1,
  image_6_label_4,
  image_7_label_9,
  image_9_label_9,
  image_10_label_0,
  image_8_label_5,
  image_11_label_6,
} from './assets/image_test_snarky_nn.js';
import { SnarkyLayer, SnarkyNet } from './snarkynet.js';
import { weights_l1, weights_l2 } from './assets/weights.js';

await isReady;

export async function createLayers() {
  await isReady;
  let layers = [
    new SnarkyLayer(weights_l1, 'relu'),
    new SnarkyLayer(weights_l2, 'softmax'),
  ];
  // console.log(layers);
  console.log('length of layers: ' + layers.length);
  // log the weights of the first layer
  console.log('weights of first layer: ' + layers[0].weights.length);
  // log the weights of the second layer
  console.log('weights of second layer: ' + layers[1].weights.length);
  // log the length of the first element of the first layer
  console.log('first element of first layer: ' + layers[0].weights[0].length);
  // log the length of the first element of the second layer
  console.log('first element of second layer: ' + layers[1].weights[0].length);
  // print the first element of the first layer
  console.log('first element of first layer: ' + layers[0].weights[0]);
  // print the first element of the second layer
  console.log('first element of second layer: ' + layers[1].weights[0]);
}

export async function generateModel() {
  await isReady;
  // get current time
  let startTime = new Date().getTime() / 1000;
  console.log('Ready');
  // weights for the model
  console.log('Create Layers', new Date().getTime() / 1000 - startTime);
  let layers = [
    new SnarkyLayer(weights_l1, 'relu'),
    new SnarkyLayer(weights_l2, 'tayler'),
  ];

  // create an instance of the model
  console.log('Create zkapp Instance', new Date().getTime() / 1000 - startTime);
  let model = new SnarkyNet(layers);
  console.log('model created', new Date().getTime() / 1000 - startTime);
  console.log(SnarkyNet);

  // predict the first image
  let startPrediction = new Date().getTime() / 1000;
  model.predict([image_0_label_7]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 7');
  //   model.predict([image_b_2]);

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_2_label_1]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 1');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_3_label_0]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 0');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_4_label_4]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 4');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_5_label_1]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 1');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_6_label_4]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 4');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_7_label_9]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 9');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_8_label_5]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 5');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_9_label_9]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 9');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_10_label_0]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 0');

  startPrediction = new Date().getTime() / 1000;
  model.predict([image_11_label_6]);
  console.log('Predict took:', new Date().getTime() / 1000 - startPrediction);
  console.log('Expecting to be 6');
  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );

  //   model.predict([image_c_1]);
  //   console.log(
  //     'after second classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );

  //   model.predict([image_d_0]);
  //   console.log(
  //     'after third classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );

  //   model.predict([image_e_4]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
  //   model.predict([image_f_1]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
  //   model.predict([image_g_4]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
  //   model.predict([image_h_9]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
  //   model.predict([image_i_5]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
  //   model.predict([image_j_9]);

  //   console.log(
  //     'after fourth classification took some time',
  //     new Date().getTime() / 1000 - startTime
  //   );
}

console.log('Start');
// await runSnarkNet();
await createLayers();
generateModel();

console.log('End');
