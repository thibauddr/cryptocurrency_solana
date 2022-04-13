/**
 * A chain holds every block, or every transaction, that takes place on the blockchain. 
 */
class Chain {
    static instance = new Chain();
    // initializing our chain with no records
    constructor() {
        this.chain = [new Block("", new Transaction(100, "temp", "temp"))];
    }
    getPreviousBlockHash() {
        // sending the entire block itself
        return this.chain[this.chain.length - 1].getHash();
    }
    insertBlock(transaction, senderPublicKey, sig) {
        // create verifier
        const verify = crypto.createVerify("SHA256");
        // add the transaction JSON
        verify.update(transaction.toString());
        // Verify it with the sender's public key
        const isValid = verify.verify(senderPublicKey, sig);
        if (isValid) {
            const block = new Block(this.getPreviousBlockHash(), transaction);
            console.log("Block added", block.toString());
            this.chain.push(block);
        }
    }
}