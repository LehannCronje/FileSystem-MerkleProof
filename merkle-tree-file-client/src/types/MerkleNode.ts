export default interface MerkleNode {
    hash: string,
    direction: string
  }

export interface MerkleRootPayload {
  hashes: Array<string>
}