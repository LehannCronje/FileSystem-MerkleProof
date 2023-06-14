import { SHA256 } from "crypto-js";
import MerkleNode from "../types/MerkleNode";


/**
 * Generates the Merkle Root hash from given Proof
 * 
 * @param merkleProof 
 * @returns the root hash string generated from the given proof
 */
const getMerkleRootFromMerkleProof = (merkleProof: Array<MerkleNode>) : string => {
    if(!merkleProof || merkleProof.length === 0) {
        return '';
    }
    const merkleRootFromProof = merkleProof.reduce((hashProof1, hashProof2) => {
        if(hashProof2.direction === 'RIGHT') {
            const node: MerkleNode = {
                hash: SHA256(hashProof1.hash + hashProof2.hash).toString(),
                direction: 'RIGHT'
            }
            return node
        }
        const node: MerkleNode = {
            hash: SHA256(hashProof2.hash + hashProof1.hash).toString(),
            direction: 'LEFT'
        }
    
        return node
    });
    return merkleRootFromProof.hash;
}

/**
 * Generates a merkle root hash from the original given hashes which will become
 * the lead nodes in the
 * 
 * @param hashes 
 * @returns the root hash string generated from original list of hashes
 */
const generateMerkleRoot = (hashes: Array<string>): string => {
    if(!hashes || hashes.length === 0) {
        return '';
    }
    if(hashes.length === 1) {
        return hashes[0]
    }
    if(hashes.length % 2 !== 0) {
        hashes.push(hashes[hashes.length - 1]);
    }
    const combinedHashes = [];
    for(let i = 0; i < hashes.length; i += 2) {
        const hashPairConcatenated = hashes[i] + hashes[i + 1];
        const hash = SHA256(hashPairConcatenated).toString();
        combinedHashes.push(hash);
    }
    if(combinedHashes.length === 1) {
        return combinedHashes.join('');
    }
    return generateMerkleRoot(combinedHashes);
}

const validateMerkleProof = (proof: Array<MerkleNode>): Boolean => {
    let root = getMerkleRootFromMerkleProof(proof)
    console.log(root)
    return localStorage.getItem("merkleroot") === root
}

const MerkleService = {
    getMerkleRootFromMerkleProof,
    generateMerkleRoot,
    validateMerkleProof
}

export default MerkleService