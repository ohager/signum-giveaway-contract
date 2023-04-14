import {generateMasterKeys} from "@signumjs/crypto";
import {Amount} from "@signumjs/util";
import  inquirer from "inquirer";
import {provideLedger} from "./helper/provideLedger.mjs";
import {confirmTransaction} from "./helper/confirmTransaction.mjs";
import {handleError} from "./helper/handleError.mjs";
import {ContractConstants, LedgerNodeUrls} from "./helper/constants.mjs";
import {printTaskHeader} from "./helper/printTaskHeader.mjs";

async function askParams() {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'ledger',
                choices: ['TestNet', 'MainNet'],
                default: 'TestNet',
                message: "Which network?",
            },
            {
                type: 'input',
                name: 'contractId',
                message: 'The contracts id?',
                validate: async (input, answers) => {
                    try{
                        console.log('validate', input, answers)
                        const ledger = provideLedger(LedgerNodeUrls[answers.ledger], false)
                        await validateContract(ledger, input.trim())
                        return true
                    }catch(e){
                        return e.message
                    }
                }
            },
            {
                type: 'input',
                name: 'amount',
                message: 'How much SIGNA you want send to the contract?'
            }
        ])
}

async function validateContract(ledger, contractId) {
    const {machineCodeHashId} = await ledger.contract.getContract(contractId)
    if(machineCodeHashId !== ContractConstants.MachineCodeHash){
        throw new Error(`Machine code hash for address [${contractId}] does not match`)
    }
}

async function publish(params) {
    try {
        const {passphrase} = await confirmTransaction(params);
        const ledger = provideLedger(LedgerNodeUrls[params.ledger])
        const senderKeys = generateMasterKeys(passphrase);

        const transaction = await ledger.transaction.sendAmountToSingleRecipient({
            amountPlanck: Amount.fromSigna(params.amount).getPlanck(),
            feePlanck: Amount.fromSigna(0.02).getPlanck(),
            deadline: 60,
            senderPrivateKey: senderKeys.signPrivateKey,
            senderPublicKey: senderKeys.publicKey,
            recipientId: params.contractId
        })

        console.info("🔌 Contract successfully charged")
        console.info("==================================")
        console.info('tx id:', transaction.transaction)
        console.info('tx hash:', transaction.fullHash)
    } catch (e) {
        // If the API returns an exception,
        // the return error object is of type HttpError
        handleError(e);
    }
}
export async function taskCharge(){
    printTaskHeader('Charge')
    const params = await askParams();
    return publish(params)
}
