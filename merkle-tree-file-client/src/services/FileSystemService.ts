import { SHA256 } from "crypto-js";
import http from "../http-common";
import MerkleService from "./MerkleService";
import { MerkleRootPayload } from "../types/MerkleNode";

const upload = async (files: Array<File>, onUploadProgress: (progressEvent: any) => void): Promise<any> => {
    let merklerRootPayload:MerkleRootPayload = { hashes : [] }
    let formData = new FormData();

    var promises = generatedFileUploadPromises(files, formData, merklerRootPayload)
        
    return Promise.all(promises).then(() => {
        let root = MerkleService.generateMerkleRoot(merklerRootPayload.hashes.map(hash => hash))
        localStorage.setItem("merkleroot", root)
        return http.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                },
            onUploadProgress,
            });
    })

};

const generatedFileUploadPromises = (files: Array<File>, formData:FormData, payload: MerkleRootPayload): Array<Promise<void>> => {
    return files.map(async file => {
        return getBase64(file).then((base64String:any) => {
            return new Promise<void>((resolve) => {
                let hash = SHA256(file.name+base64String).toString()
                payload.hashes.push(hash)
                formData.append("files", file);
                formData.append("hashes", hash)
                resolve()
            })
        })

    })
}

const getFiles = () : Promise<any> => {
  return http.get("/files");
};

const downloadFile = (hash: String) : Promise<any> => {
    return http.get(`/download/${hash}`)
}

const tamperWithTree = () : Promise<any> => {
    return http.post("/tree/tamper")
}

const destroyTree = () : Promise<any> => {
    return http.post("/tree/destroy")
}


const getBase64 = (file: File) : Promise<any> => {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result?.slice(23)); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const FileUploadService = {
  upload,
  getFiles,
  downloadFile,
  tamperWithTree,
  destroyTree
};

export default FileUploadService;
