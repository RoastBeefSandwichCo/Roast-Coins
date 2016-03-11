Roast Coins Endpoints for QGK

Set-up

All endpoints require config.php to be configured with the Roast Coins database name, host, username, and password.
Simply navigate to yourdomain.com/rcindex.php for the available endpoints

List of Available Endpoints 


The index of endpoints:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/rcindex.php

Usage:  Navigate to page and select an endpoint to query


Get the pending transactions:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/pending.php

Usage: Navigate to the page


Get the completed transactions:  https://github.com/whotooktwarden/QuickGatewayKit/blob/master/completed.php

Usage: Navigate to the page 
Note:  Error management will occur whenever a completed transaction is missing a blockchain transaction ID.
completed.php will only show transactions where the finished field is set to 1 an when a txid has been successfully recorded.


GET all transactions by coin symbol and by external address (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_crypto_symbol_by_external_address.php

Usage:  Navigate to thedomain.com/get_crypto_symbol_by_external_address.php?cryptocode=COIN_CODE?external=address


GET all transactions by external account (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_transactions_by_external_address.php

Usage:  Navigate to thedomain.com/get_crypto_symbol_by_external_address.php?external=address


GET all transactions by external account and by UNIX timestamp (requires user input):  
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_external_address_by_timestamp.php

Usage:  Navigate to thedomain.com/get_crypto_symbol_by_external_address.php?timestamp=UNIX_timestamp?external=address
Note:  You can use www.unixtimestamp.com for conversions to UNIX time.


GET all transactions by blockchain txid (requires user input):
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_transactions_by_txid.php

Usage:  thedomain.com/get_transactions_by_txid.php?txid=transactionID


GET all transactions by blockhash (requires user input):
https://github.com/whotooktwarden/QuickGatewayKit/blob/master/get_transactions_by_blockhash.php

Usage:  thedomain.com/get_transactions_by_txid.php?blockhash=blockhash


Proposed Endpoints


Please use this format for proposals:


GET all transactions by field (optionally an by second field) (requires user input, if not GET variables are used then omit):
Link to end-point when completed

Proposal:  Remove this line upon completion.  Propose which template will be used for the basis of a new end-point if applicable.  Explain thoroughly what selectors (if any) will be used to display data. 

Usage:  Navigate to the page (if no GET variables are used).  
Otherwise use the format thedomain.com/get_transactions_by_field.php?GETVARIABLE=GET_DATA

