// Description: SnarkyTensor allows for the methods utilized for manipulating tensors
export { SnarkyTensor };

import { Field } from 'snarkyjs';

class SnarkyTensor {
  // multiplier for decimal conversion for number to field conversions
  decimal_multiplier:   number;   

  constructor( decimal_multiplier = Math.pow( 10, 10 ) ) {
    // Multiplier for representing decimals
    this.decimal_multiplier = decimal_multiplier;

  }
  
  // Description:   Perform a dot product for two rank 2 tensors of type Field
  // Input:         m1 - Rank 2 Tensor of type Field
  //                m2 - Rank 2 Tensor of type Field
  // Output:        y - Dot product Rank 2 Tensor of type Field
  dot_product_t2( m1: Array<Field>[], m2: Array<Field>[] ): Array<Field>[] {
    // Perform a dot product on the two rank 2 tensors
    let y = Array();
    let m2_t = this.transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < m2_t.length; j++ ) {
        m_array[ j ]= this.dot_product_t1( m1[ i ],  m2_t[ j ] ); 
      }
      y[ i ] = m_array;
    }
    return y;
  }

  // Description:   Perform a dot product for two rank 1 tensors of type Field
  // Input:         m1 - Rank 1 Tensor of type Field
  //                m2 - Rank 1 Tensor of type Field
  // Output:        y - Dot product Rank 0 Tensor of type Field
  dot_product_t1( v1: Array<Field>, v2: Array<Field> ): Field {
    let y = Field.zero;
    v1.forEach( ( v1_value, i ) => 
      y = y.add( v1_value.mul( v2[ i ] ) ) 
    );
    return y;
  }

  // Description:   Transpose a rank 2 tensor of type Field
  // Input:         x - Rank 2 Tensor of type Field
  // Output:        y - Transposed Rank 2 Tensor of type Field of x
  transpose( x: Array<Field>[] ): Array<Field>[] {
    // Transpose the rank 2 tensor
    let y = Array();
    for ( let i = 0; i < x[0].length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < x.length; j++ ) {
        m_array[ j ] = x[ j ][ i ]; 
      }
      y[ i ] = m_array;
    }
    return y;
  }

  // Description:   Calculate the expotential
  // Input:         x - Rank 0 Tensor of type Field for the power
  // Output:        y - Rank 0 Tensor of type Field result of calculation
  exp( x: Field ): Field {
    // Expotential Implementation
    // Field representation of e
    let e = this.num2field( 2.71828 )
    // TODO - need to determine how to do a power to a Field decimal?
    let y = Field.zero;
    return y
  }

  // Description:   Convert a Rank 2 Tensor of numbers to Rank 2 Tensor of Fields
  // Input:         x - Rank 2 Tensor of type number
  // Output:        y - Rank 2 Tensor of type Field
  num2field_t2( x: Array<number>[] ): Array<Field>[] {
    let y = Array();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2field_t1( value )
    )
    return y
  }

  // Description:   Convert a Rank 1 Tensor of numbers to Rank 1 Tensor of Fields
  // Input:         x - Rank 1 Tensor of type number
  // Output:        y - Rank 1 Tensor of type Field
  num2field_t1( x: Array<number> ): Array<Field> {
    // Convert array of numbers to array of fields
    let y = Array<Field>();
    x.forEach( ( value, index ) => 
      y[ index ] = this.num2field( value )
    )
    return y;
  }

  // Description:   Convert number to a Field taking in account the decimals, if applicable
  // Input:         x - number
  // Output:        y - Field
  num2field( x: number ): Field {
    // Obtain a Field representation of the value
    return Field( Math.round( x * this.decimal_multiplier ) ).div( this.decimal_multiplier )
  }
}