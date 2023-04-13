#program name ClaimSigna
#program description This easy contract allows accounts to claim Signa once. Nice for some airdrops. It can be recharged at any time, but the amount to be sent can be set only on initialization
#program activationAmount 0.25

#define REFUND_TO_CREATOR 0xd5ca19c6bbe89178

// Variables to initialize
long amountToSendPerAccount;

struct TXINFO {
    long txId,
        sender,
        amount,
        message[4];
} currentTX;

void main(void) {
    while ((currentTX.txId = getNextTx()) != 0) {
        currentTX.sender = getSender(currentTX.txId);
        currentTX.amount = getAmount(currentTX.txId);
        readMessage(currentTX.txId, 0, currentTX.message);
        switch (currentTX.message[0]) {
            case REFUND_TO_CREATOR:
                refundToCreator();
                break;
            default:
                txReceived();
        }
    }
}

void refundToCreator() {
    // creator can stop giveaway and get the funds back
    if(currentTX.sender == getCreator()){
        sendBalance(getCreator());
    }
}


void txReceived(void) {
    // creator must not claim
    if(currentTX.sender == getCreator()){
        return;
    }

    // only one claim per account
    if(!getMapValue(1, currentTX.sender)){
        setMapValue(1, currentTX.sender, 1);
        sendAmount(amountToSendPerAccount, currentTX.sender);
    }
}
