//code snippet by Steven. Use as base.

/*TODO: There was another chunk of code that I integrated this into for testing, now floating around as "main.js".
Get it from McShane, merge if useful, discard if obsolete. */

blockchainPoller.pollForBlocks(function(block, next) {
  block.forEach(transaction, function(transaction) {          
      gatewayd.data.models.externalAccounts.findOrCreate({
        name: 'bitcoin',
        uid: transaction.address
      })
      .then(function(externalAccount) {
        gatewayd.data.models.externalTransactions.create({
          amount: transaction.amount,
          currency: 'BTC',
          externalAccountId: externalAccount.id,
          uid: transaction.hash
        })
      })
  });
  next(); // proceed to the next block of transactions
});
