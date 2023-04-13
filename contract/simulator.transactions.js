/**
 * The transaction sequence for the simulation in
 * https://deleterium.info/sc-simulator/
 *
 * Creator Id: 555n
 * Contract Id: 999n
 * Activation Amount: 2500_0000
 *
 * DO NOT FORGET TO SET THE amountToSendPerAccount during simulation
 *
 */


// Read the complete help at https://github.com/deleterium/SC-Simulator/blob/main/README.md
const SimulatorTransactions =
  [
    {
      // Creator charges
      "blockheight": 2,
      "sender": "555n",
      "recipient": "999n",
      "amount": "10_0000_0000n" // 10 SIGNA
    },
    {
      // Anybody can charge the account
      "blockheight": 4,
      "sender": "2000n",
      "recipient": "999n",
      "amount": "10_0000_0000n" // 10 SIGNA - but gets some amount back
    },
    {
      // claims signa
      "blockheight": 4,
      "sender": "3000n",
      "recipient": "999n",
      "amount": "2500_0000n"
    },
    {
      // claims signa - but has claimed and gets nothing though
      "blockheight": 6,
      "sender": "3000n",
      "recipient": "999n",
      "amount": "2500_0000n"
    },
    {
      // sending refund Message as non-creator: nothing happens
      "blockheight": 8,
      "sender": "3000n", // not creator
      "recipient": "999n",
      "amount": "2500_0000",
      "messageHex": "7891e8bbc619cad5000000000000000000000000000000000000000000000000"
    },
    {
      // sending refund Message as creator
      "blockheight": 10,
      "sender": "555n",
      "recipient": "999n",
      "amount": "2500_0000",
      "messageHex": "7891e8bbc619cad5000000000000000000000000000000000000000000000000"
    }
  ]

