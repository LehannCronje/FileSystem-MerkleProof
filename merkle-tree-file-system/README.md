# Merkle Tree File System Server

Server that stores uploaded files in a Merkle Tree. An endpoint is exposed where these uploaded files can be downloaded again. On file download a Merkle Proof will be provided.

# Build

run `gradle build`

# Container

1. run `docker build -t {image name} .`
2. run `docker run -d -p 8080:8080 {image}`

# Endpoints
###
`GET /getFiles` 

Returns a list of uploaded files.
```
Response - returns [
    {
        {
            name: String,
            hash: String
        }
    }
]
```
`POST /upload`

Receives form data for Multipart files and hashes and saves them.
```
Request - form data
{
    files: [MultipartFile],
    hashes: [String]
}

Response - returns ResponseEntity
```
`GET /download/{hash}`

Returns a file based on it's given hash.
```
Request - Path Variable: hash:String
Response - returns {
    name: String,
    base64: String,
    proof: [
        {
            hash: String,
            direction: String
        }
    ]
}
```
`POST /tree/tamper`

Changes a hash in the tree and reconstructs the Merkle Tree.

```
Response - returns ResponseEntity
```

`POST /tree/destroy`

Destroys the Merkle Tree

```
Response - returns ResponseEntity
```

# Merkle Tree

## Merkle Tree Generation

The tree is constructed by using the given `files` and `hashes` as the leaf nodes. With the leaf nodes a `buildTree` method is called that loops through the children. It assigns the left node first and then checks if the right node would move out of bounds. If this happens it appends a duplicate node equal to the left node.

After the left and right node is assigned, a parent is created with the `leftChild` and `rightChild`, combining their hashes to make it's own.

All the parents are added to a list and the method is called recursively where the parents now become the children until there is only 1 element left in the list. 

This then is returned as the root node.

## Merkle Proof Generation

First the `leaf` is selected that is equal to the given `hash`. This leaf gets added to a list. If the leaf is located as a `leftChild` of the parent, the direction is set to `LEFT` and vice versa.

The current `parent` of the selected node is determined and the node is added either as a right or a left located node. If the node is located on the right, the adjacent left node should be added to the proof list, and vice versa.

This loop continues until the parent of the last node is null, which would be the root node.

Example of list: `[{"leaf-hash", "LEFT"}, {"hash-right-adjacent-of-leaf", "RIGHT"}, {"parent-hash-left-of-root", "LEFT"}]`





