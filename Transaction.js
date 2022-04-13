/**
 * The basic properties of a transaction will be the amount, senderPublicKey, and recieverPublicKey
 */
class Transaction {

    constructor(amount, senderPublicKey, recieverPublicKey) {
        this.amount = amount;
        this.senderPublicKey = senderPublicKey;
        this.recieverPublicKey = recieverPublicKey;
    }

    toString() {
        return JSON.stringify(this);
    }
}