package lehanncronje.merkletreefilesystem.controller



import lehanncronje.merkletreefilesystem.service.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.lang.Exception
import java.util.Base64


@RestController("")
@CrossOrigin(origins = ["*", "http://localhost:8081"])
class FileSystemController {
    private lateinit var merkleTree: MerkleTree

    /**
     *  Returns a list of [FileResponseDto] retrieved from the [MerkleTree].
     *  Checks first if the merkleTree is initialized since we lazy/late init it.
     *  Returns no content response if it is not initialized or leafs are empty
     *  */
    @GetMapping("/files")
    fun getFiles(): ResponseEntity<List<FileResponseDto>> {
        if (this::merkleTree.isInitialized) {
            val files = merkleTree.leafs.map { FileResponseDto.from(it) }
            if (files.isNotEmpty()) {
                return ResponseEntity.ok(files)
            }
        }
        return ResponseEntity.noContent().build()
    }

    /**
     * Returns OK or Internal Server error
     * Accepts form data entries, [files] and [hashes]
     * Each hash is parallel associated with the given [MultipartFile]
     * */
    @PostMapping("/upload", consumes = ["multipart/form-data"])
    fun uploadFiles(
        @RequestParam("files") files: List<MultipartFile>,
        @RequestParam("hashes") hashes: List<String>
    ): ResponseEntity<String> {
        runCatching {
            merkleTree = createTree(files.mapIndexed { index, file -> File.from(file, hashes[index]) })
        }.onFailure {
            return ResponseEntity.internalServerError().build()
        }
        return ResponseEntity.ok("Successfully uploaded files")
    }


    /**
     * Returns [FileDownloadResponseDto] which contains the merkle proof of the given [hash].
     */
    @GetMapping("/download/{hash}")
    fun downloadFile(@PathVariable("hash") hash: String): ResponseEntity<FileDownloadResponseDto> {
        try {
            val leafContent = merkleTree.findLeaf(hash).content ?: return ResponseEntity.notFound().build()
            val proof = merkleTree.getMerkleProof(hash)
            return ResponseEntity.ok(
                FileDownloadResponseDto(
                    name = leafContent.name,
                    base64 = leafContent.base64,
                    proof = proof
                )
            )
        } catch (e: Exception) {
            return ResponseEntity.internalServerError().build()
        }
    }

    /**
     * Returns [ResponseEntity].
     * Changes the leaf located as the first element to a Tampered Hash.
     * This is to show when the tree changes, so does the Root hash.
     */
    @PostMapping("/tree/tamper")
    fun tamper(): ResponseEntity<String> {
        runCatching {
            merkleTree.leafs[1].hash = "Tampered Hash"
            merkleTree.recreate()
        }.onFailure {
            return ResponseEntity.internalServerError().build()
        }
        return ResponseEntity.ok("Tree tampered with")
    }

    /**
     * Returns [ResponseEntity].
     * Destroys the tree.
     */
    @PostMapping("/tree/destroy")
    fun destroyTree(): ResponseEntity<String> {
        runCatching {
            merkleTree.destroyTree()
        }.onFailure {
            return ResponseEntity.internalServerError().build()
        }
        return ResponseEntity.ok("Tree destroyed")
    }
}

data class File(
    val base64: String,
    val name: String,
    val hash: String
) {
    companion object {
        fun from(file: MultipartFile, hash: String): File {
            return File(
                base64 = Base64.getEncoder().encodeToString(file.bytes),
                name = file.originalFilename ?: "has no name",
                hash = hash
            )
        }
    }
}

data class FileResponseDto(
    val name: String,
    val hash: String
) {
    companion object {
        fun from(node: Node): FileResponseDto = node.content?.let {
            FileResponseDto(
                it.name,
                node.hash
            )
        } ?: FileResponseDto(
            "",
            ""
        )
    }
}

data class FileDownloadResponseDto(
    val name: String,
    val base64: String,
    val proof: List<ProofNode>?
)
