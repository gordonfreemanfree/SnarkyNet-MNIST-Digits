// Description: SnarkyTensor allows for the methods utilized for manipulating tensors
export { SnarkyTensor };

import { Field } from 'snarkyjs';
import { Int64 } from './Int64.js';


class SnarkyTensor {
  // multiplier for decimal conversion for number to Int64 conversions
  decimal_multiplier:   number;   

  constructor( power = 8 ) {
    // Multiplier for representing decimals
    this.decimal_multiplier = Math.pow( 2, power );
  }

  // Description:   Perform a dot product for two rank 2 tensors of type Int64
  // Input:         m1 - Rank 2 Tensor of type Int64
  //                m2 - Rank 2 Tensor of type Int64
  // Output:        y - Dot product Rank 2 Tensor of type Int64
  dot_product_t2( m1: Array<Int64>[], m2: Array<Int64>[] ): Array<Int64>[] {
    // Perform a dot product on the two rank 2 tensors
    let y = Array();
    let m2_t = this.transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array();
      for ( let j = 0; j < m2_t.length; j++ ) {
        m_array[ j ]= this.dot_product_t1( m1[ i ],  m2_t[ j ] ); 
      }
      y[ i ] = m_array;
    }
    return y;
  }

  // Description:   Perform a dot product for two rank 1 tensors of type Int64
  // Input:         m1 - Rank 1 Tensor of type Int64
  //                m2 - Rank 1 Tensor of type Int64
  // Output:        y - Dot product Rank 0 Tensor of type Int64
  dot_product_t1( v1: Array<Int64>, v2: Array<Int64> ): Int64 {
    let y = new Int64( Field.zero );
    v1.forEach( ( v1_value, i ) => 
      y = y.add( v1_value.mul( v2[ i ] ) ).divMod( this.decimal_multiplier )[0]
    );
    return y;
  }

  // Description:   Transpose a rank 2 tensor of type Int64
  // Input:         x - Rank 2 Tensor of type Int64
  // Output:        y - Transposed Rank 2 Tensor of type Int64 of x
  transpose( x: Array<Int64>[] ): Array<Int64>[] {
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
  // Input:         x - Rank 0 Tensor of type Int64 for the power
  // Output:        y - Rank 0 Tensor of type Int64 result of calculation
  exp( x: Int64 ): Int64 {
    // Expotential Implementation
    // Int64 representation of e
    let e = this.num2float( 2.71828 )
    // TODO - need to determine how to do a power to a Int64 decimal?
    let y = e;
    return y
  }

  // Description:   Convert a Rank 2 Tensor of numbers to Rank 2 Tensor of Int64s
  // Input:         x - Rank 2 Tensor of type number
  // Output:        y - Rank 2 Tensor of type Int64
  num2float_t2( x: Array<number>[] ): Array<Int64>[] {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float_t1( value )
    )
    return y
  }

  // Description:   Convert a Rank 1 Tensor of numbers to Rank 1 Tensor of Int64s
  // Input:         x - Rank 1 Tensor of type number
  // Output:        y - Rank 1 Tensor of type Int64
  num2float_t1( x: Array<number> ): Array<Int64> {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float( value )
    )
    return y;
  }

  // Description:   Convert number to a Int64 taking in account the decimals, if applicable
  // Input:         x - number
  // Output:        y - Int64
  num2float( x: number ): Int64 {
    return new Int64( Field( Math.floor( x * this.decimal_multiplier ) ) )
  }
}
