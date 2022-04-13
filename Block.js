/**
 * The term “blockchain” means exactly what it sounds like – a chain of blocks. 
 * The chain is the collection of blocks (that contain the transactions) linked to 
 * each other so that we can access them in a systematic manner.
 */
class Block {

    constructor(previousHash, transaction, timestamp = Date.now()) {
        this.previousHash = previousHash;
        this.transaction = transaction;
        this.timestamp = timestamp;
    }

    getHash() {
        const json = JSON.stringify(this);
        const hash = crypto.createHash("SHA256");
        hash.update(json).end();
        const hex = hash.digest("hex");
        return hex;
    }

    toString() {
        return JSON.stringify(this);
    }
}