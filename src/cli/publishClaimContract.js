const {generateMasterKeys} = require("@signumjs/crypto");
const {
    Amount,
} = require("@signumjs/util");
const {provideLedger, handleError, confirmTransaction, LedgerHostUrls} = require('./helper');
const inquirer = require("inquirer");


function askParams() {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'ledger',
                choices: ['TestNet', 'MainNet'],
                default: 'TestNet',
            },
            {
                type: 'input',
                name: 'amount',
                message: 'How much SIGNA can be claimed per account?'
            },
            {
                type: 'input',
                name: 'name',
                message: 'The contracts name? Based on a given event maybe?'
            }
        ])
}

const ContractReferences = {
    MainNet: '',
    TestNet: '920BF14AB0AD3A462FF50341E7EBCF09933EBD16D4718F42651063C6EC406F06'
}

/**
 * This is an example for the real world ClaimContract(by referencing existing code).
 * The contract allows people to claim SIGNA, like airdrops
 *
 */
async function publishClaimContract(params) {
    try {

        console.info("Your parameters:", params)
        const ledger = provideLedger(LedgerHostUrls[params.ledger])
        const {passphrase} = await confirmTransaction();
        const senderKeys = generateMasterKeys(passphrase);
        const toSendPerAccount = Amount.fromSigna(params.amount).getPlanck()
        const initialContractReference = ContractReferences[params.ledger];
        const {transaction} = await ledger.contract.publishContractByReference({
            referencedTransactionHash: initialContractReference,
            feePlanck: Amount.fromSigna(0.2).getPlanck(), // as the imaginary contract issues a token, we need to send at least 150 SIGNA
            data: [0, 0, 0, 0, toSendPerAccount],
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.signPrivateKey,
            name: `ClaimContract_${params.name}`,
            description: `This simple contract allows accounts to claim ${params.amount} Signa  once. Nice for some airdrops. It can be recharged at any time, but the amount to be sent can be set only on initialization`
        })

        console.info('Call successful - tx id:', transaction)
    } catch (e) {
        // If the API returns an exception,
        // the return error object is of type HttpError
        handleError(e);
    }
}

(async () => {
    const params = await askParams();
    await publishClaimContract(params);
})();
