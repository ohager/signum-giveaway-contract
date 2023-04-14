import {generateMasterKeys} from "@signumjs/crypto";
import {Amount} from "@signumjs/util";
import  inquirer from "inquirer";
import {provideLedger} from "./helper/provideLedger.mjs";
import {LedgerNodeUrls, ContractConstants} from "./helper/constants.mjs";
import {confirmTransaction} from "./helper/confirmTransaction.mjs";
import {handleError} from "./helper/handleError.mjs";
import {printTaskHeader} from "./helper/printTaskHeader.mjs";
import {Address} from "@signumjs/core";

const DefaultName = "GiveAwayContract"

async function askParams() {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'ledger',
                choices: ['TestNet', 'MainNet'],
                message: "Which network?",
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
                message: 'The contracts name? Based on a given event maybe?',
                default: DefaultName
            },
            {
                type: 'input',
                name: 'alias',
                message: 'If you want to reference this contract to an alias, then write an alias here',
                default: ''
            },
        ])
}

function mountSRC44Description(params) {
    const descriptor = {vs:1, tp:"smc"}
    if(params.alias){
        descriptor.al = params.alias
    }
    return JSON.stringify(descriptor)
}

async function publish(params) {
    try {
        const {passphrase} = await confirmTransaction(params);
        const ledger = provideLedger(LedgerNodeUrls[params.ledger])
        const senderKeys = generateMasterKeys(passphrase);
        const toSendPerAccount = Amount.fromSigna(params.amount).getPlanck()
        const initialContractReference = ContractConstants.References[params.ledger];
        const transaction = await ledger.contract.publishContractByReference({
            referencedTransactionHash: initialContractReference,
            feePlanck: Amount.fromSigna(0.2).getPlanck(),
            data: [0, 0, 0, 0, toSendPerAccount],
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.signPrivateKey,
            name: params.name,
            description: mountSRC44Description(params)
        })

        console.info("🎉 Contract successfully published")
        console.info("==================================")
        console.info('Transaction full hash', transaction.fullHash)
        console.info('The contract Id will be:', transaction.transaction)
        console.info('The contract address will be:', Address.fromNumericId(transaction.transaction).getReedSolomonAddress(false))

    } catch (e) {
        // If the API returns an exception,
        // the return error object is of type HttpError
        handleError(e);
    }
}
export async function taskCreate(){
    printTaskHeader('Create')
    const params = await askParams();
    return publish(params)
}
