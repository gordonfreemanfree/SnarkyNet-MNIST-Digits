// Description: Verification tests for the SnarkyTensor class

//////////////////////////// Configure and Setup ////////////////////////////////
// Import SnarkyNet and SnarkyLayers
import { SnarkyTensor } from '../snarky_tensor.js'
import { Field, Bool, UInt64, Circuit, isReady, shutdown } from 'snarkyjs';
import { weights_l1, weights_l2 } from '../weights.js';
import { Int65 } from '../Int65.js';

// Wait for SnarkyJS
await isReady;

// Create Class
let st = new SnarkyTensor( 4 );

// Run verify tests
// verify_Int65( )
// verify_num2int65( )
// verify_dot_product_t1( )
// verify_dot_product_t2( )
verify_exp( )

/////////////////////////// Verify Int65 Assumptions ///////////////////////////
function verify_Int65( ) {
    // Int65( 0.7 )
    console.log( 'Test Int65.fromNumber( 0.7 )' )
    console.log( ' Output: ', Int65.fromNumber( Math.floor( 0.7 * 10 ) ).toString() )
    console.assert(Int65.fromNumber( Math.floor( 0.7 * 10 ) ).toString() === '7');

    console.log( 'Test Int65( Field( 1 ) )' )
    console.log( ' Output: ', new Int65( Field( 1 ), Field( 1 ) ).toString() )
    console.assert(new Int65( Field( 1 ), Field( 1 ) ).toString() === '1');


    // Int65( Field( 255 ) )
    console.log( 'Test Int65( Field( 255 ) )' )
    console.log( ' Output: ', new Int65( Field( 255 ), Field( 1 ) ).toString() )

    // Int65( Field( 255 ) ).add( 1 )
    console.log( 'Test Int65( Field( 255 ) ).add( 1 )' )
    console.log( ' Output: ', new Int65( Field( 255 ), Field( 1 ) ).add( new Int65( Field( 1 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 255 ) ).add( 2 )
    console.log( 'Test Int65( Field( 255 ) ).add( 2 )' )
    console.log( ' Output: ', new Int65( Field( 255 ), Field( 1 ) ).add( new Int65( Field( 2 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 1 ) ).div( 4 )
    console.log( 'Test Int65( Field( 1 ) ).div( 4 )' )
    console.log( ' Output: ', new Int65( Field( 1 ), Field( 1 ) ).div( new Int65( Field( 4 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 1 ) ).div( 4 ).mul( 4 )
    console.log( 'Test Int65( Field( 1 ) ).div( 4 ).mul( 4 )' )
    console.log( ' Output: ', new Int65( Field( 1 ), Field( 1 ) ).div( new Int65( Field( 4 ), Field( 1 ) ) ).mul( new Int65( Field( 4 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 4 ) ).div( 16 ).mul( 4 )
    console.log( 'Test Int65( Field( 4 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int65( Field( 4 ), Field( 1 ) ).div( new Int65( Field( 16 ), Field( 1 ) ) ).mul( new Int65( Field( 4 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 32 ) ).div( 16 ).mul( 4 ) 
    console.log( 'Test Int65( Field( 32 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int65( Field( 32 ), Field( 1 ) ).div( new Int65( Field( 16 ), Field( 1 ) ) ).mul( new Int65( Field( 4 ), Field( 1 ) ) ).toString() )

    // Int65( Field( 36 ) ).div( 16 ).mul( 4 )
    console.log( 'Test Int65( Field( 36 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int65( Field( 36 ), Field( 1 ) ).div( new Int65( Field( 16 ), Field( 1 ) ) ).mul( new Int65( Field( 4 ), Field( 1 ) ) ).toString() )
}


//////////////////////////////// Test num2int65 ////////////////////////////////
function verify_num2int65( ) {
    // num2int65( 1 )
    console.log( 'Test num2int65( 1 )' )
    console.log( ' Output: ', st.num2int65( 1 ).toString() )
    console.assert(st.num2int65( 1 ).toString() === '100000000');

    console.log( 'Test num2int65( 0.7 )' )
    console.log( ' Output: ', st.num2int65( 0.7 ).toString() )
    console.assert(st.num2int65( 0.7 ).toString() === '70000000');

    // num2int65( -1 )
    console.log( 'Test num2int65( -1 )' )
    console.log( ' Output: ', st.num2int65( -1 ).toString() )
    console.assert(st.num2int65( -1 ).toString() === '-100000000');

    // num2int65( -1 ).mul( num2int65( -1 ) )
    console.log( 'Test num2int65( -1 ).mul( num2int65( -1 ) )' )
    console.log( ' Output: ', st.num2int65( -1 ).mul( st.num2int65( -1 ) ).toString() )
    console.assert(st.num2int65( -1 ).mul( st.num2int65( -1 ) ).toString() === '10000000000000000');

    // num2int65( 1 ).div( 4 )
    console.log( 'Test num2int65( 1 ).div( 4 ) - truncation' )
    console.log( ' Output: ', st.num2int65( 1 ).div( st.num2int65( 4 ) ).toString() )
    console.assert(st.num2int65( -1 ).div( st.num2int65( 4 ) ).toString() === '0');

    // num2int65( 1 ).div( 4 ).mul( 4 )
    console.log( 'Test num2int65( 1 ).div( 4 ).mul( 4 ) - truncation' )
    console.log( ' Output: ', st.num2int65( 1 ).div( st.num2int65( 4 ) ).mul( st.num2int65( 4 ) ).toString() )
    console.assert(st.num2int65( -1 ).div( st.num2int65( 4 ) ).mul( st.num2int65( 4 ) ).toString() === '0');

    // num2int65( 4 ).div( 16 ).mul( 4 )
    console.log( 'Test num2int65( 4 ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', st.num2int65( 4 ).div( st.num2int65( 16 ) ).mul( st.num2int65( 4 ) ).toString() )
    console.assert(st.num2int65( 4 ).div( st.num2int65( 16 ) ).mul( st.num2int65( 4 ) ).toString() === '0');

    // num2int65( 0.25 )
    console.log( 'Test num2int65( 0.25 )' )
    console.log( ' Output: ', st.num2int65( 0.25 ).toString() )
    console.assert(st.num2int65( 0.25 ).toString() === '25000000');

    // num2int65( 0.25 ).mul( 4 )
    console.log( 'Test num2int65( 0.25 ).mul( 4 )' )
    console.log( ' Output: ', st.num2int65( 0.25 ).mul( st.num2int65( 4 ) ).toString() )
    console.assert(st.num2int65( 0.25 ).mul( st.num2int65( 4 ) ).toString() === '10000000000000000');

    // num2int65( 0.25 ).mul( num2int65( 0.25 ) )
    console.log( 'Test num2int65( 0.25 ).mul( num2int65( 0.25 ) )' )
    console.log( ' Output: ', st.num2int65( 0.25 ).mul( st.num2int65( 0.25 ) ).toString() )
    console.assert(st.num2int65( 0.25 ).mul( st.num2int65( 0.25 ) ).toString() === '625000000000000');

    // num2int65( 0.25 ).mul( num2int65( -0.25 ) )
    console.log( 'Test num2int65( 0.25 ).mul( num2int65( -0.25 ) )' )
    console.log( ' Output: ', st.num2int65( 0.25 ).mul( st.num2int65( -0.25 ) ).toString() )
    console.assert(st.num2int65( 0.25 ).mul( st.num2int65( -0.25 ) ).toString() === '-625000000000000');

    // num2int65( 0.25 ).mul( num2int65( 0.25 ) )
    console.log( 'Test num2int65( 0.25 ).mul( num2int65( 0.25 ) ).div( decimal_multipler )' )
    console.log( ' Output: ', st.num2int65( 0.25 ).mul( st.num2int65( 0.25 ) ).div( st.scale_factor_int65 ).toString() )
    console.assert(st.num2int65( 0.25 ).mul( st.num2int65( 0.25 ) ).div( st.scale_factor_int65 ).toString() === '6250000');

    // num2int65( 0.05408422648906708 ).mul( num2int65( -0.7308298349380493 ) )
    console.log( 'Test num2int65( 0.05408422648906708 ).mul( num2int65( -0.7308298349380493 ) )' )
    console.log( ' Output: ', st.num2int65( 0.05408422648906708 ).mul( st.num2int65( -0.7308298349380493 ) ).toString() )
    console.assert(st.num2int65( 0.05408422648906708  ).mul( st.num2int65( -0.7308298349380493 ) ).toString() === '-395263618491248');
}

//////////////////////////////// Test dot_product_t1 ////////////////////////////////
function vector2string( v: Array<Int65> | Array<Field> | Array<number> ): Array<string> {
    let output = Array();
    v.forEach( ( value, i ) => 
        output[ i ] = value.toString() )
    return output;
}

function verify_dot_product_t1( ) {

    console.log( 'Create v1 [ 0.25, 1, 2 ]' );
    let v1 = st.num2int65_t1( [ 0.25, 1, 2 ]);
    console.log( vector2string( v1 ) );

    console.log( 'Create v2 [ -0.25, -1, -2 ]' );
    let v2 = st.num2int65_t1( [ -0.25, -1, -2 ]);
    console.log( vector2string( v2 ) );

    console.log( ' dot_product_t1( v1, v1 )' )
    console.log( ' Output: ', st.dot_product_t1( v1, v1 ).toString() )
    console.assert( st.dot_product_t1( v1, v1 ).toString() === '506250000');

    console.log( ' dot_product_t1( v1, v2 )' )
    console.log( ' Output: ', st.dot_product_t1( v1, v2 ).toString() )
    console.assert( st.dot_product_t1( v1, v2 ).toString() === '-506250000');

    console.log( ' dot_product_t1( v2, v2 )' )
    console.log( ' Output: ', st.dot_product_t1( v2, v2 ).toString() )
    console.assert( st.dot_product_t1( v2, v2 ).toString() === '506250000');

}

//////////////////////////////// Test dot_product_t2 ////////////////////////////////
function verify_dot_product_t2( ) {
    function matrix2string( v: Array<Int65>[] | Array<Field>[] | Array<number>[]  ) {
        v.forEach( ( value, i ) => 
            console.log(  vector2string( value ) ) )
    }

    console.log( 'Create m1 ' );
    let m1 = [  st.num2int65_t1( [ 0.25, 1, 2 ]),
                st.num2int65_t1( [ 0.25, 1, 2 ]),
                st.num2int65_t1( [ 0.25, 1, 2 ])]
    matrix2string( m1 );

    console.log( 'Dot Product Output' );
    let m_1_out = st.dot_product_t2( m1, m1 )
    matrix2string( m_1_out );
    console.log( 'Dot Product Expected' );
    matrix2string( [ [812500, 3250000, 6500000],
                     [812500, 3250000, 6500000],
                     [812500, 3250000, 6500000] ] );

    console.log( 'Create m2' );
    let m2 = [  st.num2int65_t1( [ 0.25, 1, 2 ]),
                st.num2int65_t1( [ 0.25, 1, 2 ])]
    matrix2string( m2 );

    console.log( 'Create m3' );
    let m3 = [  st.num2int65_t1( [ 0.25, 1 ]),
                st.num2int65_t1( [ 0.25, 1 ]),
                st.num2int65_t1( [ 0.25, 1 ])]
    matrix2string( m3 );

    console.log( 'Dot Product Output' );
    let m_2_out = st.dot_product_t2( m2, m3 )
    matrix2string( m_2_out );
    console.log( 'Dot Product Expected' );
    matrix2string( [ [812500, 3250000],
                     [812500, 3250000] ] );
    
    // Crash
    let m_3_out = st.dot_product_t2( st.num2int65_t2( weights_l1 ), st.num2int65_t2( weights_l2 ) )
}

async function test_rec( x: Int65 ): Promise<Int65> {
    console.log( x.toString() )
    return await Circuit.if( Bool( x.equals( Int65.zero ).toBoolean() ),
        Int65.zero,
        await test_rec( x.sub( Int65.fromNumber( 1 ) ) )
 )
}

function verify_exp( ){
    console.log( "exp( 5.0 ): ", Number( st.exp( st.num2int65( 5.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 148.413159102576603" )
    console.log( "exp( 4.5 ): ", Number( st.exp( st.num2int65( 4.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 90.017131300521814" )
    console.log( "exp( 4.0 ): ", Number( st.exp( st.num2int65( 4.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 54.598150033144239" )
    console.log( "exp( 3.5 ): ", Number( st.exp( st.num2int65( 3.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 33.115451958692314" )
    console.log( "exp( 3.0 ): ", Number( st.exp( st.num2int65( 3.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 20.085536923187668" )
    console.log( "exp( 2.5 ): ", Number( st.exp( st.num2int65( 2.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 12.182493960703473" )
    console.log( "exp( 2.0 ): ", Number( st.exp( st.num2int65( 2.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 7.38905609893065" )
    console.log( "exp( 1.5 ): ", Number( st.exp( st.num2int65( 1.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 4.481689070338065" )
    console.log( "exp( 0.5 ): ", Number( st.exp( st.num2int65( 0.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 1.648721270700128" )
    console.log( "exp( -0.5 ): ", Number( st.exp( st.num2int65( -0.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.606530659712633" )
    console.log( "exp( -0.1 ): ", Number( st.exp( st.num2int65( -0.1 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.90483741803596" )
    console.log( "exp( -2.0 ): ", Number( st.exp( st.num2int65( -2.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.135335283236613" )
    console.log( "exp( -2.5 ): ", Number( st.exp( st.num2int65( -2.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.082084998623899" )
    console.log( "exp( -3.0 ): ", Number( st.exp( st.num2int65( -3.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.049787068367864" )
    console.log( "exp( -3.5 ): ", Number( st.exp( st.num2int65( -3.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.030197383422319" )
    console.log( "exp( -4.0 ): ", Number( st.exp( st.num2int65( -4.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.018315638888734" )
    console.log( "exp( -4.5 ): ", Number( st.exp( st.num2int65( -4.5 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.011108996538242" )
    console.log( "exp( -5.0 ): ", Number( st.exp( st.num2int65( -5.0 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 0.006737946999085" )

    console.log( "exp( 67.09920126 ): ", Number( st.exp( st.num2int65( 67.09920126 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 1.382970280327077e29" )
    console.log( "exp( 106.4289438 ): ", Number( st.exp( st.num2int65( 106.4289438 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 1.665340358854376e46" )

    console.log( "exp( -67.09920126 ): ", Number( st.exp( st.num2int65( -67.09920126 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 1.10292811e-25" )
    console.log( "exp( -106.4289438 ): ", Number( st.exp( st.num2int65( -106.4289438 ) ).toString() ) / Math.pow( 10, 4 ), " Expected: 9.15918956e-43" )

    
    
}

// Shutdown
shutdown();