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
let st = new SnarkyTensor( );

// Run verify tests
// verify_Int65( )
// verify_num2float( )
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


//////////////////////////////// Test num2float ////////////////////////////////
function verify_num2float( ) {
    // num2float( 1 )
    console.log( 'Test num2float( 1 )' )
    console.log( ' Output: ', st.num2float( 1 ).toString() )
    console.assert(st.num2float( 1 ).toString() === '100000000');

    console.log( 'Test num2float( 0.7 )' )
    console.log( ' Output: ', st.num2float( 0.7 ).toString() )
    console.assert(st.num2float( 0.7 ).toString() === '70000000');

    // num2float( -1 )
    console.log( 'Test num2float( -1 )' )
    console.log( ' Output: ', st.num2float( -1 ).toString() )
    console.assert(st.num2float( -1 ).toString() === '-100000000');

    // num2float( -1 ).mul( num2float( -1 ) )
    console.log( 'Test num2float( -1 ).mul( num2float( -1 ) )' )
    console.log( ' Output: ', st.num2float( -1 ).mul( st.num2float( -1 ) ).toString() )
    console.assert(st.num2float( -1 ).mul( st.num2float( -1 ) ).toString() === '10000000000000000');

    // num2float( 1 ).div( 4 )
    console.log( 'Test num2float( 1 ).div( 4 ) - truncation' )
    console.log( ' Output: ', st.num2float( 1 ).div( st.num2float( 4 ) ).toString() )
    console.assert(st.num2float( -1 ).div( st.num2float( 4 ) ).toString() === '0');

    // num2float( 1 ).div( 4 ).mul( 4 )
    console.log( 'Test num2float( 1 ).div( 4 ).mul( 4 ) - truncation' )
    console.log( ' Output: ', st.num2float( 1 ).div( st.num2float( 4 ) ).mul( st.num2float( 4 ) ).toString() )
    console.assert(st.num2float( -1 ).div( st.num2float( 4 ) ).mul( st.num2float( 4 ) ).toString() === '0');

    // num2float( 4 ).div( 16 ).mul( 4 )
    console.log( 'Test num2float( 4 ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', st.num2float( 4 ).div( st.num2float( 16 ) ).mul( st.num2float( 4 ) ).toString() )
    console.assert(st.num2float( 4 ).div( st.num2float( 16 ) ).mul( st.num2float( 4 ) ).toString() === '0');

    // num2float( 0.25 )
    console.log( 'Test num2float( 0.25 )' )
    console.log( ' Output: ', st.num2float( 0.25 ).toString() )
    console.assert(st.num2float( 0.25 ).toString() === '25000000');

    // num2float( 0.25 ).mul( 4 )
    console.log( 'Test num2float( 0.25 ).mul( 4 )' )
    console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( 4 ) ).toString() )
    console.assert(st.num2float( 0.25 ).mul( st.num2float( 4 ) ).toString() === '10000000000000000');

    // num2float( 0.25 ).mul( num2float( 0.25 ) )
    console.log( 'Test num2float( 0.25 ).mul( num2float( 0.25 ) )' )
    console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).toString() )
    console.assert(st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).toString() === '625000000000000');

    // num2float( 0.25 ).mul( num2float( -0.25 ) )
    console.log( 'Test num2float( 0.25 ).mul( num2float( -0.25 ) )' )
    console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( -0.25 ) ).toString() )
    console.assert(st.num2float( 0.25 ).mul( st.num2float( -0.25 ) ).toString() === '-625000000000000');

    // num2float( 0.25 ).mul( num2float( 0.25 ) )
    console.log( 'Test num2float( 0.25 ).mul( num2float( 0.25 ) ).div( decimal_multipler )' )
    console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).div( st.scale_factor_int65 ).toString() )
    console.assert(st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).div( st.scale_factor_int65 ).toString() === '6250000');

    // num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) )
    console.log( 'Test num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) )' )
    console.log( ' Output: ', st.num2float( 0.05408422648906708 ).mul( st.num2float( -0.7308298349380493 ) ).toString() )
    console.assert(st.num2float( 0.05408422648906708  ).mul( st.num2float( -0.7308298349380493 ) ).toString() === '-395263618491248');
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
    let v1 = st.num2float_t1( [ 0.25, 1, 2 ]);
    console.log( vector2string( v1 ) );

    console.log( 'Create v2 [ -0.25, -1, -2 ]' );
    let v2 = st.num2float_t1( [ -0.25, -1, -2 ]);
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
    let m1 = [  st.num2float_t1( [ 0.25, 1, 2 ]),
                st.num2float_t1( [ 0.25, 1, 2 ]),
                st.num2float_t1( [ 0.25, 1, 2 ])]
    matrix2string( m1 );

    console.log( 'Dot Product Output' );
    let m_1_out = st.dot_product_t2( m1, m1 )
    matrix2string( m_1_out );
    console.log( 'Dot Product Expected' );
    matrix2string( [ [812500, 3250000, 6500000],
                     [812500, 3250000, 6500000],
                     [812500, 3250000, 6500000] ] );

    console.log( 'Create m2' );
    let m2 = [  st.num2float_t1( [ 0.25, 1, 2 ]),
                st.num2float_t1( [ 0.25, 1, 2 ])]
    matrix2string( m2 );

    console.log( 'Create m3' );
    let m3 = [  st.num2float_t1( [ 0.25, 1 ]),
                st.num2float_t1( [ 0.25, 1 ]),
                st.num2float_t1( [ 0.25, 1 ])]
    matrix2string( m3 );

    console.log( 'Dot Product Output' );
    let m_2_out = st.dot_product_t2( m2, m3 )
    matrix2string( m_2_out );
    console.log( 'Dot Product Expected' );
    matrix2string( [ [812500, 3250000],
                     [812500, 3250000] ] );
    
    // Crash
    let m_3_out = st.dot_product_t2( st.num2float_t2( weights_l1 ), st.num2float_t2( weights_l2 ) )
}

async function test_rec( x: Int65 ): Promise<Int65> {
    console.log( x.toString() )
    return await Circuit.if( Bool( x.equals( Int65.zero ).toBoolean() ),
        Int65.zero,
        await test_rec( x.sub( Int65.fromNumber( 1 ) ) )
 )
}

function verify_exp( ){
    //console.log( test_rec( Int65.fromNumber( 5 ) ) )
    console.log( st.exp( Int65.fromNumber( 963254250 ) ).toString() )

}

// Shutdown
shutdown();