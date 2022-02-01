// Description: Verification tests for the SnarkyTensor class

//////////////////////////// Configure and Setup ////////////////////////////////
// Import SnarkyNet and SnarkyLayers
import { SnarkyTensor } from '../snarky_tensor.js'
import { Field, isReady, shutdown } from 'snarkyjs';
import { weights_l1, weights_l2 } from '../weights.js';
import { Int64 } from '../Int64.js';

// Wait for SnarkyJS
await isReady;

// Create Class
let st = new SnarkyTensor( );

// Run verify tests
// verify_Int64( )
//verify_field( )
// verify_sfloat( )
verify_num2float( )
//verify_dot_product_t1( )
//verify_dot_product_t2( )

/////////////////////////// Verify Int64 Assumptions ///////////////////////////
function verify_Int64( ) {
    // Int64( Field( 1 ) )
    console.log( 'Test Int64( Field( 1 ) )' )
    console.log( ' Output: ', new Int64( Field( 1 ) ).toString() )

    // Int64( Field( 255 ) )
    console.log( 'Test Int64( Field( 255 ) )' )
    console.log( ' Output: ', new Int64( Field( 255 ) ).toString() )

    // Int64( Field( 255 ) ).add( 1 )
    console.log( 'Test Int64( Field( 255 ) ).add( 1 )' )
    console.log( ' Output: ', new Int64( Field( 255 ) ).add( new Int64( Field( 1 ) ) ).toString() )

    // Int64( Field( 255 ) ).add( 2 )
    console.log( 'Test Int64( Field( 255 ) ).add( 2 )' )
    console.log( ' Output: ', new Int64( Field( 255 ) ).add( new Int64( Field( 2 ) ) ).toString() )

    // Int64( Field( 1 ) ).div( 4 )
    console.log( 'Test Int64( Field( 1 ) ).div( 4 )' )
    console.log( ' Output: ', new Int64( Field( 1 ) ).div( 4 ).toString() )

    // Int64( Field( 1 ) ).div( 4 ).mul( 4 )
    console.log( 'Test Int64( Field( 1 ) ).div( 4 ).mul( 4 )' )
    console.log( ' Output: ', new Int64( Field( 1 ) ).div( 4 ).mul( 4 ).toString() )

    // Int64( Field( 4 ) ).div( 16 ).mul( 4 )
    console.log( 'Test Int64( Field( 4 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int64( Field( 4 ) ).div( 16 ).mul( 4 ).toString() )

    // Int64( Field( 32 ) ).div( 16 ).mul( 4 ) 
    console.log( 'Test Int64( Field( 32 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int64( Field( 32 ) ).div( 16 ).mul( 4 ).toString() )

    // Int64( Field( 36 ) ).div( 16 ).mul( 4 )
    console.log( 'Test Int64( Field( 36 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', new Int64( Field( 36 ) ).div( 16 ).mul( 4 ).toString() )
}


/////////////////////////// Verify Int64 Assumptions ///////////////////////////
function verify_field( ) {
    // Field( 1 )
    console.log( 'Test Field( 1 )' )
    console.log( ' Output: ', Field( 1 ).toString() )

    // Field( -1 )
    console.log( 'Test Field( -1 )' )
    console.log( ' Output: ', Field( -1 ).toString() )

    // Field( -1 ).neg()
    console.log( 'Test Field( -1 ).neg()' )
    console.log( ' Output: ', Field( -1 ).neg().toString() )

    // Field( 255 )
    console.log( 'Test Field( 255 )' )
    console.log( ' Output: ', Field( 255 ).toString() )

    // Field( 255 ).add( 1 )
    console.log( 'Test Field( 255 ).add( 1 )' )
    console.log( ' Output: ', Field( 255 ).add( 1 ).toString() )

    // Field( 255 ).add( 2 )
    console.log( 'Test Field( 255 ).add( 2 )' )
    console.log( ' Output: ', Field( 255 ).add( 2 ).toString() )

    // Field( 1 ).div( 4 )
    console.log( 'Test Field( 1 ).div( 4 )' )
    console.log( ' Output: ', Field( 1 ).div( 4 ).toString() )

    // Field( 1 ).div( 4 ).mul( 4 )
    console.log( 'Test Field( 1 ).div( 4 ).mul( 4 )' )
    console.log( ' Output: ', Field( 1 ).div( 4 ).mul( 4 ).toString() )

    // Field( 4 ).div( 16 ).mul( 4 )
    console.log( 'Test Field( 4 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', Field( 4 ).div( 16 ).mul( 4 ).toString() )

    // Field( 32 ).div( 16 ).mul( 4 ) 
    console.log( 'Test Field( 32 ) ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', Field( 32 ).div( 16 ).mul( 4 ).toString() )

    // Field( 36 ).div( 16 ).mul( 4 )
    console.log( 'Test Field( 36 ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', Field( 36 ).div( 16 ).mul( 4 ).toString() )
}

//////////////////////////////// Test num2float ////////////////////////////////
function verify_num2float( ) {
    // num2float( 1 )
    console.log( 'Test num2float( 1 )' )
    console.log( ' Output: ', st.num2float( 1 ).toString() )

    // num2float( 254 )
    console.log( 'Test num2float( 254 )' )
    console.log( ' Output: ', st.num2float( 254 ).toString() )

    // num2float( 255 )
    console.log( 'Test num2float( 255 )' )
    console.log( ' Output: ', st.num2float( 255 ).toString() )

    // num2float( 255 )
    console.log( 'Test num2float( 255 ).add( 1 ) ' )
    console.log( ' Output: ', st.num2float( 255 ).add( st.num2float( 1 ) ).toString() )

    // num2float( -1 )
    console.log( 'Test num2float( -1 )' )
    console.log( ' Output: ', st.num2float( -1 ).toString() )

    // num2float( -1 ).mul( num2float( -1 ) )
    console.log( 'Test num2float( -1 ).mul( num2float( -1 ) )' )
    console.log( ' Output: ', st.num2float( -1 ).mul( -1 ).divMod( 256 )[0].toString() )

    // num2float( 1 ).div( 4 )
    console.log( 'Test num2float( 1 ).div( 4 )' )
    console.log( ' Output: ', st.num2float( 1 ).div( 4 ).toString() )

    // num2float( 1 ).div( 4 ).mul( 4 )
    console.log( 'Test num2float( 1 ).div( 4 ).mul( 4 )' )
    console.log( ' Output: ', st.num2float( 1 ).div( 4 ).mul( 4 ).toString() )

    // num2float( 4 ).div( 16 ).mul( 4 )
    console.log( 'Test num2float( 4 ).div( 16 ).mul( 4 )' )
    console.log( ' Output: ', st.num2float( 4 ).div( 16 ).mul( 4 ).toString() )

    // num2float( 0.25 )
    console.log( 'Test num2float( 0.25 )' )
    console.log( ' Output: ', st.num2float( 0.25 ).toString() )

    // num2float( 0.25 ).mul( 4 )
    console.log( 'Test num2float( 0.25 ).mul( 4 )' )
    console.log( ' Output: ', st.num2float( 0.25 ).mul( 4 ).toString() )

    // num2float( 0.25 ).mul( num2float( 0.25 ) )
    //console.log( 'Test num2float( 0.25 ).mul( num2float( 0.25 ) )' )
    // console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).toString() )

    // num2float( 0.25 ).mul( num2float( 0.25 ) )
    //console.log( 'Test num2float( 0.25 ).mul( num2float( 0.25 ) ).div( decimal_multipler )' )
    // console.log( ' Output: ', st.num2float( 0.25 ).mul( st.num2float( 0.25 ) ).div( st.decimal_multiplier ).toString() )

    // Crash
    // -0.7308298349380493 0.05408422648906708
    // num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) )
    console.log( 'Test num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) ).div( decimal_multipler )' )
    console.log( ' Output: ', st.num2float( 0.05408422648906708 ).mul( st.num2float( -0.7308298349380493 ) ).div( st.decimal_multiplier ).toString() )

    // -0.7308298349380493 0.05408422648906708
    // num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) )
    //console.log( 'Test num2float( 0.05408422648906708 ).mul( num2float( -0.7308298349380493 ) ).div( decimal_multipler )' )
    // console.log( ' 05408422648906708:', st.num2float( 0.05408422648906708 ).toString() )
    // console.log( ' -0.7308298349380493:', st.num2float( -0.7308298349380493 ).toString() )
    // console.log( ' -0.7308298349380493:', st.num2float( -0.7308298349380493 ).mul(-1).toString() )
    // let result = st.num2float( 0.05408422648906708 ).mul( st.num2float( -0.7308298349380493 ).mul(-1) )
    // console.log( ' Output: ', result.toString() )
    // console.log( ' Output: ', result.divMod( st.decimal_multiplier )[0].toString() )
    // console.log( ' Output: ', result.divMod( st.decimal_multiplier )[1].toString() )
}

//////////////////////////////// Test dot_product_t1 ////////////////////////////////
function vector2string( v: Array<Int64> | Array<Field> | Array<number> ): Array<string> {
    let output = Array();
    v.forEach( ( value, i ) => 
        output[ i ] = value.toString() )
    return output;
}

function verify_dot_product_t1( ) {

    console.log( 'Create v1 [ 0.25, 1, 2 ]' );
    let v1 = st.num2float_t1( [ 0.25, 1, 2 ]);
    console.log( vector2string( v1 ) );

    console.log( ' Output: ', st.dot_product_t1( v1, v1 ).toString() )
    console.log( ' Expected: 5062500' )

    console.log( 'Create v2 [ -0.25, -1, -2 ]' );
    let v2 = st.num2float_t1( [ -0.25, -1, -2 ]);
    console.log( vector2string( v2 ) );

    console.log( ' Output: ', st.dot_product_t1( v2, v2 ).toString() )
    console.log( ' Expected: 5062500' )

    // Crash
    let v3_out = st.dot_product_t1( st.num2float_t1( weights_l1[0] ), st.num2float_t1( weights_l2[0] ) )

}

//////////////////////////////// Test dot_product_t2 ////////////////////////////////
function verify_dot_product_t2( ) {
    function matrix2string( v: Array<Int64>[] | Array<Field>[] | Array<number>[]  ) {
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

// Shutdown
shutdown();