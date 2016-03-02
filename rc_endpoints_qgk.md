Roast Coins Endpoints for QGK

The index to select a endpoint:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/rcindex.php

The index for all entries to the coin_index table (i.e. the full index):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/full_index.php

Changes:  Refactor to get all information about the blockchain_transactions table.

Get the pending transactions:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/pending.php

Changes:  Refactor to get all information about the blockchain_transactions table.  SQL statement finished field requires change from true/false 
to 1/0.

Get the completed transactions:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/completed.php

Changes:  Refactor to get all information about the blockchain_transactions table.  SQL statement finished field requires change from true/false  
to 1/0.

GET all transactions by coin symbol and by external address (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_crypto_symbol_by_external_address.php

Changes:  Refactor to get all information about the blockchain_transactions table.

GET all transactions by external account (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_transactions_by_external_address.php

Changes:  Refactor to get all information about the blockchain_transactions table.

GET all transactions by external account and by coin symbol (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_external_address_by_timestamp.php

Changes:  Refactor to get all information about the blockchain_transactions table.
