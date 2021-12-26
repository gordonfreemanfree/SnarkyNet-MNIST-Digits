// Description: SnarkyTensor allows for the methods utilized for manipulating tensors
export { SnarkyTensor };

import { UInt64, Field, Bool } from 'snarkyjs';

class SnarkyTensor {
  // multiplier for decimal conversion for number to UInt64 conversions
  decimal_multiplier:   number;   

  constructor( power = 6 ) {
    // Multiplier for representing decimals
    this.decimal_multiplier = Math.pow( 10, power );
  }

  // Description:   Perform a dot product for two rank 2 tensors of type UInt64
  // Input:         m1 - Rank 2 Tensor of type UInt64
  //                m2 - Rank 2 Tensor of type UInt64
  // Output:        y - Dot product Rank 2 Tensor of type UInt64
  dot_product_t2( m1: Array<UInt64>[], m2: Array<UInt64>[] ): Array<UInt64>[] {
    // Perform a dot product on the two rank 2 tensors
    let y = Array();
    let m2_t = this.transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array();
      for ( let j = 0; j < m2_t.length; j++ ) {
        console.log( i, j )
        m_array[ j ]= this.dot_product_t1( m1[ i ],  m2_t[ j ] ); 
      }
      y[ i ] = m_array;
    }
    console.log( 'Returning Dot Product' )
    return y;
  }

  // Description:   Perform a dot product for two rank 1 tensors of type UInt64
  // Input:         m1 - Rank 1 Tensor of type UInt64
  //                m2 - Rank 1 Tensor of type UInt64
  // Output:        y - Dot product Rank 0 Tensor of type UInt64
  dot_product_t1( v1: Array<UInt64>, v2: Array<UInt64> ): UInt64 {
    let y = new UInt64( Field.zero );
    //v1.forEach( ( v1_value, i ) => 
    //  y = y.add( v1_value.mul( v2[ i ] ) ) 
    //);
    for ( let i = 0; i < v1.length; i++ ) {
      console.log( 'i', i );
      console.log( 'v1', v1[ i ].toString() );
      console.log( 'v2', v2[ i ].toString() );

      y = y.add( v1[ i ].mul( v2[ i ] ) ) ;
    }
    console.log( y.toString() )
    return y;
  }

  // Description:   Transpose a rank 2 tensor of type UInt64
  // Input:         x - Rank 2 Tensor of type UInt64
  // Output:        y - Transposed Rank 2 Tensor of type UInt64 of x
  transpose( x: Array<UInt64>[] ): Array<UInt64>[] {
    // Transpose the rank 2 tensor
    let y = Array();
    for ( let i = 0; i < x[0].length; i++ ) {
      let m_array = Array();
      for ( let j = 0; j < x.length; j++ ) {
        m_array[ j ] = x[ j ][ i ]; 
      }
      y[ i ] = m_array;
    }
    return y;
  }

  // Description:   Calculate the expotential
  // Input:         x - Rank 0 Tensor of type UInt64 for the power
  // Output:        y - Rank 0 Tensor of type UInt64 result of calculation
  exp( x: UInt64 ): UInt64 {
    // Expotential Implementation
    // UInt64 representation of e
    let e = this.num2float( 2.71828 )
    // TODO - need to determine how to do a power to a UInt64 decimal?
    let y = e;
    return y
  }

  // Description:   Convert a Rank 2 Tensor of numbers to Rank 2 Tensor of UInt64s
  // Input:         x - Rank 2 Tensor of type number
  // Output:        y - Rank 2 Tensor of type UInt64
  num2float_t2( x: Array<number>[] ): Array<UInt64>[] {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float_t1( value )
    )
    return y
  }

  // Description:   Convert a Rank 1 Tensor of numbers to Rank 1 Tensor of UInt64s
  // Input:         x - Rank 1 Tensor of type number
  // Output:        y - Rank 1 Tensor of type UInt64
  num2float_t1( x: Array<number> ): Array<UInt64> {
    let y = Array<UInt64>();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float( value )
    )
    return y;
  }

  // Description:   Convert number to a UInt64 taking in account the decimals, if applicable
  // Input:         x - number
  // Output:        y - UInt64
  num2float( x: number ): UInt64 {
    return new UInt64( Field( Math.round( x * this.decimal_multiplier ) ) )
  }
}
