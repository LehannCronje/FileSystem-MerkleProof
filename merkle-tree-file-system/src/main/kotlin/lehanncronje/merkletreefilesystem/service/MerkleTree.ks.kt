package lehanncronje.merkletreefilesystem.service

import lehanncronje.merkletreefilesystem.controller.File
import lehanncronje.merkletreefilesystem.utils.sha256
import java.lang.Exception

/** [Node] data class */
data class Node(
    val left: Node?,
    val right: Node?,
    var hash: String,
    var parent: Node?,
    var content: Content?
) {
    /** Determine if Node is position on the left side of parent */
    fun isLeft() = parent?.left?.hash == hash

    companion object {
        fun createParent(leftChild: Node, rightChild: Node) = Node(
            left = leftChild,
            right = rightChild,
            hash = (leftChild.hash + rightChild.hash).sha256(),
            parent = null,
            content = null
        )

        fun empty() = Node(null, null, "", null,null)
    }
}

/** Link [Node.parent] to child */
fun Node.linkParent(parent: Node) {
    this.parent = parent
}


data class Content(
    val base64: String,
    val name: String
)

data class ProofNode(
    val hash: String?,
    val direction: String
) {
    companion object {
        fun create(node: Node) = ProofNode(
            hash = node.hash,
            direction = if(node.parent?.left?.hash == node.hash) "LEFT" else "RIGHT"
        )
        fun createRight(node: Node) = ProofNode(
            hash = node.right?.hash,
            direction = "RIGHT"
        )
        fun createLeft(node: Node) = ProofNode(
            hash = node.left?.hash,
            direction = "LEFT"
        )
    }
}

/** Returns a [MerkleTree] from the given [files] */
fun createTree(files: List<File>): MerkleTree {
    val childNodes = mutableListOf<Node>()
    for (file in files) {
        childNodes.add(Node(null,null, file.hash, null, Content(file.base64, file.name)))
    }
    val root = buildTree(childNodes)
    return MerkleTree(
        root,
        childNodes,
        root.hash
    )
}

/** [MerkleTree] data class */
data class MerkleTree(
    var root: Node,
    var leafs: List<Node>,
    var merkleRootHash: String
)

/** rebuild [MerkleTree] based on current leafs */
fun MerkleTree.recreate() {
    val root = buildTree(leafs.toMutableList())
    this.root = root
    this.merkleRootHash = root.hash
}

/**
 * Helper function for constructing the [MerkleTree]
 * Recursively constructs levels and returns the root [Node]
 * */
private fun buildTree(children: MutableList<Node>): Node {
    val parents = mutableListOf<Node>()
    val length = children.size

    if(length == 1) {
        return children[0]
    }

    var index = 0
    while (index < length) {
        val lefChild: Node = children[index]

        val rightChild: Node = if((index + 1) < length) {
            children[index + 1]
        } else {
            //Add another node to the right if it moves out of bounds
            Node(null,null, lefChild.hash, lefChild.parent, null)
        }

        val parentNode = Node.createParent(lefChild, rightChild)

        rightChild.linkParent(parentNode)
        lefChild.linkParent(parentNode)

        parents.add(parentNode)
        index += 2
    }
    return buildTree(parents)
}

/**
 * Generates a MerkleProof from current [MerkleTree].
 * MerkleProof -> Quickest path towards the root [Node] from a given leaf [Node].
 * */
fun MerkleTree.getMerkleProof(hash: String): List<ProofNode>? {
    if (leafs.isEmpty()){
        return null
    }

    var node = findLeaf(hash)

    val merkleProof = mutableListOf<ProofNode>()
    merkleProof.add(ProofNode.create(node))
    var currentParent = node.parent
    while (currentParent != null) {
        if (node.isLeft()) {
            merkleProof.add(
                ProofNode.createRight(currentParent)
            )
        } else {
            merkleProof.add(
                ProofNode.createLeft(currentParent)
            )
        }
        node = currentParent
        currentParent = currentParent.parent
    }
    return merkleProof
}

/** Returns a [Node] from the list of leafs that matches the given [hash].
 *  Throws error if none could be found.
 * */
fun MerkleTree.findLeaf(hash: String) =
    try {
        leafs.single { it.hash == hash }
    } catch (e: Exception) {
        throw e
    }

/** Destroys the [MerkleTree] by setting root [Node] to empty */
fun MerkleTree.destroyTree() {
    root = Node.empty()
    leafs = listOf()
    merkleRootHash = ""
}

