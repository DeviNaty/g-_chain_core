"use strict";

const { Managers } = require("@arkecosystem/crypto");
const utils = require("./utils");
const { delegates } = require("../../../../lib/utils/testnet");
const testUtils = require("../../../../lib/utils/test-utils");
const { TransactionFactory } = require('../../../../../helpers/transaction-factory');

/**
 * Creates a transaction to a new wallet
 * @param  {Object} options = { }
 * @return {void}
 */
module.exports = async options => {
    Managers.configManager.setFromPreset("testnet");

    const transactions = [];
    const nonce = TransactionFactory.getNonce(delegates[0].publicKey);

    Object.keys(utils.wallets).forEach(txType => {
        const wallets = utils.wallets[txType];
        const transferAmount = 100 * Math.pow(10, 8);
        transactions.push(
            TransactionFactory.transfer(wallets[0].address, transferAmount)
                //.vendorField(`init for ${txType}`)
                .withFee(0.1 * Math.pow(10, 8))
                .withPassphrase(delegates[0].passphrase)
                .withNonce(nonce.plus(1))
                .createOne(),
            TransactionFactory.transfer(wallets[2].address, transferAmount)
                //.vendorField(`init for ${txType} - 2nd signed`)
                .withFee(0.1 * Math.pow(10, 8))
                .withPassphrase(delegates[0].passphrase)
                .createOne(),
        );

        nonce = nonce.plus(2);
    });

    await testUtils.POST("transactions", { transactions });
};
