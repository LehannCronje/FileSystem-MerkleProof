# Introduction
Given is a solution to a server and client implementation with a Merkle Tree integration for handling the validility of files between client and server using generated proofs.

# How To Run
1. Clone the repository to you local machine.
2. In the root directory open your terminal, and run `docker-compose up -d`.
3. Two containers will start up.
4. The client will start up on `localhost:3000` for you to test the uploading system.

# Projects
1. merkle-tree-file-client: Inside the directory there is a README.md explaining the project.
2. merkle-tree-file-system: Inside the directory there is a README.md explaining the project.
3. rust_server: Inside the directory there is a README.md explaining the project. (This is a partial implementation)

# My Approach

## Investigation
I first started with an investigation of the problem given. This was to fully understand what was expected of me. I layed down the requirements and also the pieces I needed to do research on. One very clear point for research, was understanding the use cases for a Merkle Tree data structure.

## From Point A To B As Fast As Possible
After I understood the application of a Merkle Tree and its use cases, I aimed to create a rough solution as quick as possible. This was aimed at showing me the complexity of the implementation and bring clarity. With this approach I could prevent creating a solution that did not meet the given requirements.

1. I first created a client where I could upload multiple files to a server.
2. I then created the backend server to accept this request and save these files appropriately.
3. After this I implemented the first version of the Merkle Tree and Proof Generation logic on the backend. 
4. I then moved over to the client and implemented the root hash generation from the initial given hashes and the regeneration of the merkle root hash from the proof received from the server on file download.

## Refinement
With an implementation that was working I then moved forward to refine it to a point that I felt comfortable with. I did this by refactoring the code. One large refactor during this step was the changing of the Merkle Tree appoach I took. My first implementation utilised a `List<List<String>>` implementation, where I would add each hash in a 2-Dimensional list. Using this approach, I had to reconstruct the array each time I wanted to calculate the proof.

From this I changed it to the current implementation, which uses Objects to build the tree. Where a `Tree` consists of `Nodes` and each `Node` consists of a (`hash`, `leftChild`, `rightChild`, `parent`).

I also styled the client to give a better user experience and refactored the code to use proper Types.

## Some Extras
After I was happy with the implementation, I added some extra features. For example - destroying the tree & tampering with the tree. This made the testing and interaction of the whole project a bit smoother and more fun.

# Solved: Problems Encountered
During the implementation process I encountered some problems which I was able to fix.

1. While I was calculating the Merkle Proof I realised that I was not adding the first node and it's position to the list. This made the root hash calculations on the client side fail the comparison. I made sure to add this before I started the creation of the Merkle Proof. [MerkTree.ks.kt:136](https://github.com/LehannCronje/FileSytem-MerkleProof/blob/56b68c51adf43b413158f3c1f0cb4f68e5f2ef50/merkle-tree-file-system/src/main/kotlin/lehanncronje/merkletreefilesystem/service/MerkleTree.ks.kt#L136)
2. Initially I was sending base64 strings from the client to the server, as I wanted to keep it simple. However since base64 strings take up a lot of space (around 30% more), this solution failed since I ran into String space problems. Therefor I opted for using a Multipart solution. (Another unexplored suggestion would have been to just send byte data to the server.)
3. I faced the issue of not being able to support different file types when I recalculated the initial hashes on the server side. My initial approach was to send a base64 string and the name to the server, and have the server recalculate the sha256 hash when the request is received. Hoewever it seemed that the base64 string that was generated on the server side was different than that of the client. I did not dive deep into why this was the case, but I changed the logic so that the client will provide the initial hashes, and the server would then construct the Merkle Tree from that.

# What Went Not So Well
- I was not able to implement proper testing. I realised that there was some refactoring needed in my implementation to help with testing properly. I would have like to have all the code fully testable for a production ready project.
- I wanted to be able to create a full rust implementation, but I was unable to do this as I ran out of time.
- I wanted to create a full file-system, where files will be saved on a local directory and then can be retrieved by using a url location. However out of the things I wanted to refactor I was not able to get to this part. Given more time I would have implemented a File-System service to handle the saving and retreiving of files and serve them to the client when they want to be downloaded.

# What Went Well
- The implementation of the merkle tree went well. I felt happy with the workings of it. Although there is always room for improvement with the small details of how the code is structured, the merkle tree worked as it should've.
- The Merkle Tree Proof generation also worked well. I was really happy with how it was generated, even with large sums of files.(f > 1000).
- Same for the client, the reconstruction of the root hash using the given proof went well. I enjoyed creating the solution.
- I had lots of fun. I enjoyed refreshing my mind, by reading and exploring. Really a great excersise.

# After Thoughts

I Enjoyed this challenge a lot. It was fun researching and understanding Merkle Trees fully and also their application in real world projects like decentralised systems and version control systems. I created a `rust_server` folder where I also tried to implement the solution in Rust. However I ran short on time, therefore I was not able to finish it. 

Learning Rust I can see will be a fun task. It's a bit different from my current languages, and is more ristrictive and implicit, however I like this about it. It reminds me of solidity a bit. I enjoyed diving into how referencing works and understanding how traits and state management works. Given some more time I'm confident I would have been able to create a rust solution.

Other than that the excersise really showed me how to enjoy a task. I also want to commend this excersise. It truly was a learning experience.