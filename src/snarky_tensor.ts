// Description: SnarkyTensor allows for the methods utilized for manipulating tensors
export { SnarkyTensor };

import { Int65 } from './Int65.js';

class SnarkyTensor {
  // multiplier for decimal conversion for number to Int65 conversions
  scale_factor:   number;
  scale_factor_int65: Int65;   

  constructor( power = 8 ) {
    // Multiplier for representing decimals
    this.scale_factor = Math.pow( 10, power );
    this.scale_factor_int65 = Int65.fromNumber( this.scale_factor );
  }

  // Description:   Perform a dot product for two rank 2 tensors of type Int65
  // Input:         m1 - Rank 2 Tensor of type Int65
  //                m2 - Rank 2 Tensor of type Int65
  // Output:        y - Dot product Rank 2 Tensor of type Int65
  dot_product_t2( m1: Array<Int65>[], m2: Array<Int65>[] ): Array<Int65>[] {
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

  // Description:   Perform a dot product for two rank 1 tensors of type Int65
  // Input:         m1 - Rank 1 Tensor of type Int65
  //                m2 - Rank 1 Tensor of type Int65
  // Output:        y - Dot product Rank 0 Tensor of type Int65
  dot_product_t1( v1: Array<Int65>, v2: Array<Int65> ): Int65 {
    let y = Int65.zero;
    console.assert( v1.length === v2.length ); // TODO - throw 
    v1.forEach( ( v1_value, i ) => 
      y = y.add( v1_value.mul( v2[ i ] ).div( this.scale_factor_int65 ) )
    );
    return y;
  }

  // Description:   Transpose a rank 2 tensor of type Int65
  // Input:         x - Rank 2 Tensor of type Int65
  // Output:        y - Transposed Rank 2 Tensor of type Int65 of x
  transpose( x: Array<Int65>[] ): Array<Int65>[] {
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
  // Input:         x - Rank 0 Tensor of type Int65 for the power
  // Output:        y - Rank 0 Tensor of type Int65 result of calculation
  exp( x: Int65 ): Int65 {
    // Expotential Implementation
    let y = Math.exp( Number( x.toString() ) / this.scale_factor )
    return Int65.fromNumber( Math.floor( y * this.scale_factor ) );  
  }

  // Description:   Convert a Rank 2 Tensor of numbers to Rank 2 Tensor of Int64s
  // Input:         x - Rank 2 Tensor of type number
  // Output:        y - Rank 2 Tensor of type Int65
  num2float_t2( x: Array<number>[] ): Array<Int65>[] {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float_t1( value )
    )
    return y
  }

  // Description:   Convert a Rank 1 Tensor of numbers to Rank 1 Tensor of Int64s
  // Input:         x - Rank 1 Tensor of type number
  // Output:        y - Rank 1 Tensor of type Int65
  num2float_t1( x: Array<number> ): Array<Int65> {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2float( value )
    )
    return y;
  }

  // Description:   Convert number to a Int65 by multiplying it by the 
  // scale factor and taking the floor
  // Input:         x - number
  // Output:        y - Int65
  num2float( x: number ): Int65 {
    return Int65.fromNumber( Math.floor( x * this.scale_factor ) );    
  }
}
