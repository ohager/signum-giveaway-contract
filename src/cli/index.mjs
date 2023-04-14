import inquirer from "inquirer";
import {taskCreate} from "./taskCreate.mjs";
import {taskCharge} from "./taskCharge.mjs";
import {taskRefund} from "./taskRefund.mjs";

function askTasks() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'task',
        choices: ['Create', 'Charge', 'Refund'],
        default: 'Publish',
        message: "What do you want to do?"
      },
    ])
}


async function start() {

  const answers = await askTasks()
  switch(answers.task) {
    case 'Create':
      return taskCreate()
    case 'Charge':
      return taskCharge()
    case 'Refund':
      return taskRefund()
    default:
      throw new Error(`Unknown Task ${answers.task}`)
      //
  }
}

(async () => {
  return start()
})()
