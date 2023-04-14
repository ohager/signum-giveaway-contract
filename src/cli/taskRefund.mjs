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

        const transaction = await ledger.contract.callContractMethod({
            methodHash: ContractConstants.Methods.RefundToCreator,
            contractId: params.contractId,
            methodArgs: [],
            amountPlanck: Amount.fromSigna(ContractConstants.ActivationCostsSigna).getPlanck(),
            feePlanck: Amount.fromSigna(0.02).getPlanck(),
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.signPrivateKey,
            deadline: 60,
        })

        console.info("🔚 Contract successfully stopped (Refund)")
        console.info("==================================")
        console.info('tx id:', transaction.transaction)
        console.info('tx hash:', transaction.fullHash)
    } catch (e) {
        handleError(e);
    }
}
export async function taskRefund() {
    printTaskHeader('Refund')
    const params = await askParams();
    return publish(params)
}
