// Description: SnarkyTensor allows for the methods utilized for manipulating tensors
export { SnarkyTensor };

import {
  Field,
  Bool,
} from 'snarkyjs';

class SnarkyTensor {
  decimal_multiplier:   number;   // multiplier for decimals

  constructor( decimal_multiplier = Math.pow( 10, 10 ) ) {
    // Multiplier for representing decimals
    this.decimal_multiplier = decimal_multiplier;

  }
  // Dot Product
  dot_product_t2( m1: Array<Field>[], m2: Array<Field>[] ): Array<Field>[] {
    // Perform a dot product on the two rank 2 tensors
    let result = Array();
    let m2_t = this.transpose( m2 );
    for ( let i = 0; i < m1.length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < m2_t.length; j++ ) {
        m_array[ j ]= this.dot_product_t1( m1[ i ],  m2_t[ j ] ); 
      }
      result[ i ] = m_array;
    }
    return result;
  }

  dot_product_t1( v1: Array<Field>, v2: Array<Field> ): Field {
    // perform a dot product on the two field arrays v1 and v2
    let result = Field.zero;
    v1.forEach( ( v1_value, i ) => 
      result = result.add( v1_value.mul( v2[ i ] ) ) 
    );
    return result;
  }

  // Transpose
  transpose( x: Array<Field>[] ): Array<Field>[] {
    // Transpose the rank 2 tensor
    let result = Array();
    for ( let i = 0; i < x[0].length; i++ ) {
      let m_array = Array<Field>();
      for ( let j = 0; j < x.length; j++ ) {
        m_array[ j ] = x[ j ][ i ]; 
      }
      result[ i ] = m_array;
    }
    return result;
  }

  // Math Helpers
  exp( x: Field ): Field {
    // Expotential Implementation
    // Field representation of e
    let e = this.num2field( 2.71828 )
    // TODO - need to determine how to do a power to a Field decimal?
    return x
  }

  // Conversion from numbers to fields
  num2field_t2( x: Array<number>[] ): Array<Field>[] {
    // Convert rank 2 tensor of numbers to rank 2 tensor of fields
    let result = Array();
    x.forEach( ( value, index ) => 
      result[ index ] = this.num2field_t1( value )
    )
    return result
  }

  num2field_t1( x: Array<number> ): Array<Field> {
    // Convert array of numbers to array of fields
    let result = Array<Field>();
    x.forEach( ( value, index ) => 
      result[ index ] = this.num2field( value )
    )
    return result;
  }

  num2field( x: number ): Field {
    // Obtain a Field representation of the value
    return Field( Math.round( x * this.decimal_multiplier ) ).div( this.decimal_multiplier )
  }
}