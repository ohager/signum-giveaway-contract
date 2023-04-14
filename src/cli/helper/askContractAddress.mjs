import inquirer from "inquirer";

/**
 * Just a helper function to ask for the account id/address
 */
export function askContractAddress() {
    // inquirer is a pretty useful lib for CLI interaction
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'account',
                message: 'What\'s the contracts id or address?'
            }
        ])
}
