// Description: Verification tests for the SnarkyTensor class

//////////////////////////// Configure and Setup ////////////////////////////////
// Import SnarkyNet and SnarkyLayers
import { SnarkyTensor } from '../snarkytensor.js'
import { Field, isReady, shutdown } from 'snarkyjs';

// Wait for SnarkyJS
await isReady;

// Create Class
let snarky_tensor = new SnarkyTensor(3);

/////////////////////////// Verify Field Assumptions ///////////////////////////
// Field( 1 )
console.log( 'Test Field( 1 )' )
console.log( ' Output: ', Field( 1 ) )

// Field( 255 )
console.log( 'Test Field( 255 )' )
console.log( ' Output: ', Field( 255 ) )

// Field( 255 ).add( 1 )
console.log( 'Test Field( 255 ).add( 1 )' )
console.log( ' Output: ', Field( 255 ).add( 1 ) )

// Field( 1 ).div( 4 )
console.log( 'Test Field( 1 ).div( 4 )' )
console.log( ' Output: ', Field( 1 ).div( 4 ) )

// Field( 1 ).div( 4 ).mul( 4 )
console.log( 'Test Field( 1 ).div( 4 ).mul( 4 )' )
console.log( ' Output: ', Field( 1 ).div( 4 ).mul( 4 ) )

// Field( 4 ).div( 16 ).mul( 4 )
console.log( 'Test Field( 4 ).div( 16 ).mul( 4 )' )
console.log( ' Output: ', Field( 4 ).div( 16 ).mul( 4 ) )

//////////////////////////////// Test num2field ////////////////////////////////
// num2field( 1 )
console.log( 'Test num2field( 1 )' )
console.log( ' Output: ', snarky_tensor.num2field( 1 ) )

// num2field( 255 )
console.log( 'Test num2field( 255 )' )
console.log( ' Output: ', snarky_tensor.num2field( 255 ) )

// num2field( 255 ).add( 1 )
console.log( 'Test num2field( 255 ).add( 1 )' )
console.log( ' Output: ', snarky_tensor.num2field( 255 ).add( 1 ) )

// num2field( 1 ).div( 4 )
console.log( 'Test num2field( 1 ).div( 4 )' )
console.log( ' Output: ', snarky_tensor.num2field( 1 ).div( 4 ) )

// num2field( 1 ).div( 4 ).mul( 4 )
console.log( 'Test num2field( 1 ).div( 4 ).mul( 4 )' )
console.log( ' Output: ', snarky_tensor.num2field( 1 ).div( 4 ).mul( 4 ) )

// num2field( 4 ).div( 16 ).mul( 4 )
console.log( 'Test num2field( 4 ).div( 16 ).mul( 4 )' )
console.log( ' Output: ', snarky_tensor.num2field( 4 ).div( 16 ).mul( 4 ) )

// num2field( 0.25 )
console.log( 'Test num2field( 0.25 )' )
console.log( ' Output: ', snarky_tensor.num2field( 0.25 ) )

// num2field( 0.25 ).mul( 4 )
console.log( 'Test num2field( 0.25 ).mul( 4 )' )
console.log( ' Output: ', snarky_tensor.num2field( 0.25 ).mul( 4 ) )

// Shutdown
shutdown();