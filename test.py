import numpy as np

# values for the softmax
values = [
-6709920126,
-10642894380,
-7516996982,
-8414149683,
-963254250,
-8553741677,
-6621014034,
-5328420105,
-6538307148,
-3387007553,
]

dec_values = np.divide( values, np.power(10, 8) )

print( dec_values )

exp_sum = sum( np.exp( dec_values ) )
softmax_result = np.divide( np.exp( dec_values ), exp_sum )
print( softmax_result )
print( max( softmax_result ) )