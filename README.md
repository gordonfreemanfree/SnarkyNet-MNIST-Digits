# SnarkyNet - MNIST Handwritten Digits
SnarkyJS implementation the Deep Neural Network for MNIST Handwritten Letters. <br>
Proof of Concept / Work in Progress
Currently Not Functional

## Description
SnarkyJS implementation of a Deep Neural Network for the MNIST Handwritten Digits Dataset. 

The training and prediction from the Neural Network are separated as follows:
 - Training of the model performed in Tensorflow 
 - Subsequent weights are integrated into a SNAPP for prediction

The development and training of the model is created in Python's Tensorflow to obtain the 
Neural Network weights associated with each node. The weights resulting from the training 
of the model are exported into an equivalent SnarkyJS Neural Network model (or SnarkyNet) 
and the usage of Tensorflow is no longer necessary. 

With the SnarkyNet model, a prediction can be performed within the circuit math to create a
proof that can be utilized in SNAPPS in a secure manner. 

### Implementation Decisions
Training of the model is performed in Tensorflow to maintain the efficiencies including GPU 
support, methods for evaluating performance, and optimization. The weights obtained from 
training the model in Tensorflow are utilized in a SnarkyJS implementation of an equivalent 
model as the circuits are not required for training but are necessary for the prediction of 
the model. Thus, the weights from the training can be ported over directly into the circuit 
for the calculations. 

#### Design of the SnarkyLayer
The implementation of the SnarkyLayers allow for an easy transition to create the SnarkyNet
for an equivalent Neural Network in SnarkyJS to the Tensorflow model. For instance, it should
follow to be equivalent

Python:
```
model = keras.Sequential( [ 
    layers.Dense( 512, activation='relu' ),
    layers.Dense( 10, activation='softmax' )
    ] )
```

SnarkyNet:
```
let layers = [  
     new SnarkyLayer( weights_l1, 'relu' ),
     new SnarkyLayer( weights_l2, 'softmax' ) 
     ];
```

where `weights_l1` and `weights_l2` correspond to the weights obtain from training of the 
Tensorflow model.

### Model Implementation
The Neural Network consists of two layers:
- Dense layer of 512 nodes with the RelU Activation Function
- Dense layer of 10 nodes with a (pseudo) Softmax Activation Function

## Flow
 1. Create Tensorflow model of the proposed model type to obtain the weights of the model.
    The weights are stored in `./src/weights.js` and imported into the SNAPP
 3. Create SnarkyJS equivalent model (`SnarkyNet`) with the weights for each layer (`SnarkyLayer`)
 4. Create a smart contract extension utilizing the SnarkyJS model (`SmartSnarkyNet`)
 5. Run verification tests

## Notes
Currently, the RelU and Leaky RelU are the two activation functions that are utilized in 
the model until there is a method for expotential as that will allow for a sigmoid and a proper
softmax function. Currently, there is a pseudo softmax function to calculate relative probabilities
for the classifications but it is lacking the exp implementation. 

The following needs to be resolved:
 - Determine a method to perform the conversion from a positive or negative float to a Field-like 
 representation that can be used in the circuit math.
 - Implement Softmax activation function for the Field-like representation
