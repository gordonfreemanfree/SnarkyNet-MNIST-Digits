# SnarkyJS Neural Network
SnarkyJS implementation of associated artifacts necessary for the creation of neural networks. <br>
Proof of Concept

## Description
SnarkyJS implementation of a Neural Network where:
 - Training of the model performed in Tensorflow
 - Subsequent weights are integrated into a SNAPP for prediction
The weights obtained during the training and validation via Tensorflow can be utilized in the
SnarkyJS Neural Network's circuit to create a proof of the prediction utilized in the SNAPP.

### Implementation Decisions
Training of the model is performed in Tensorflow to maintain the efficiencies including GPU 
support, methods for evaluating performance, and optimization. The weights obtained from 
training the model in Tensorflow are utilized in a SnarkyJS implementation of an equivalent 
model as the circuits are not required for training but are necessary for the prediction of 
the model. Thus, the weights from the training can be ported over directly into the circuit 
for the calculations. 

### Proposed Model Types
 - Implement perceptron model as the simplest model 
 - Implement binary classification model
 - Implement convolutional neural network
 - Implement recurrent neural network
 - Implement long short term model neural network

## Flow
 1. Create Tensorflow model of the proposed model type to obtain the weights of the model
 2. Create SnarkyJS equivalent model with the weights (`SnarkyNet`)
 3. Create a smart contract extension utilizing the SnarkyJS model (`SmartSnarkyNet`)
 4. Run verification tests

## Notes
Currently, the RelU and Leaky RelU are the two activation functions that are utilized in 
the model until there is a method for expotential as that will allow for a sigmoid function.
Unfortunately, the sigmoid function is primarily used for binary classification models and
will have to be figured out to properly implement a binary classification model. 
