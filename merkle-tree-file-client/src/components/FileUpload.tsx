import { useState, useEffect, useRef } from "react";
import UploadService from "../services/FileSystemService";
import MerkleService from "../services/MerkleService";
import { IFile } from "../types/File";
import { SHA256 } from "crypto-js";

interface ProgressInfo {
    fileName: string;
    percentage: number;
}

const FilesUpload: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [progressInfo, setProgressInfo] = useState<ProgressInfo>();
    const [message, setMessage] = useState<Array<string>>([]);
    const [fileInfos, setFileInfos] = useState<Array<IFile>>([]);
    const progressInfosRef = useRef<any>(null);

    useEffect(() => {
        getFiles()
    }, []);

    const getFiles = (() => {
        UploadService.getFiles().then((response) => {
            setFileInfos(response.data);
            setProgressInfo(undefined)
        }).catch((e: any) => {
            console.log(e);
        })
    })

    const selectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(event.target.files);
        setProgressInfo(undefined);
        setMessage([]);
    };

    const upload = (files: Array<File>) => {
        let _progressInfos = progressInfosRef.current;
        return UploadService.upload(files, (event) => {
            _progressInfos.percentage = Math.round(
                (100 * event.loaded) / event.total
            );
            setProgressInfo(_progressInfos);
        })
            .then(() => {
                let fileMsg = 
                files.forEach((file) => {
                    setMessage((prevMessage) => [
                        ...prevMessage,
                        file.name + ": Upload Successful!"
                    ]);
                })
            })
            .catch((err: any) => {
                _progressInfos[0].percentage = 0;
                setProgressInfo(_progressInfos);

                let msg = files[0].name + ": Failed!";
                if (err.response && err.response.data && err.response.data.message) {
                    msg += " " + err.response.data.message;
                }

                setMessage((prevMessage) => [
                    ...prevMessage,
                    msg
                ]);
            });
    };

    const uploadFiles = () => {
        if (selectedFiles != null) {
            const files = Array.from(selectedFiles);
            let _progressInfos = files.map((file) => ({
                percentage: 0,
                fileName: file.name
            }));

            progressInfosRef.current = _progressInfos;

            const uploadPromises = upload(files);

            uploadPromises
                .then(() => UploadService.getFiles())
                .then((files) => {
                    setFileInfos(files.data);
                });

            setMessage([]);
        }
    };

    const downloadFile = (hash: string) => {
        UploadService.downloadFile(hash).then(response => {
            if (MerkleService.validateMerkleProof(response.data.proof)) {
                console.log(response.data)
                var a = document.createElement("a")
                a.href = "data:image/png;base64," + response.data.base64
                a.download = response.data.name
                a.click()
            } else {
                setMessage(() => [
                    "Proof verification failed. Download blocked."
                ])
            }
        }).catch((e) => {
            console.log(e)
        })

    }

    const tamper = () => {
        UploadService.tamperWithTree().then(()=>{
            setMessage(() => ["Tampered with tree"])
            getFiles()
        })
    }

    const destroyTree = () => {
        UploadService.destroyTree().then(() => {
            setMessage(() => ["Destroyed tree"])
            getFiles()
        })
    }

    return (
        <div className="card p-3">
            {progressInfo &&
                    <div className="mb-2">
                        <span>{progressInfo.fileName}</span>
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-info"
                                role="progressbar"
                                aria-valuenow={progressInfo.percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: progressInfo.percentage + "%" }}
                            >
                                {progressInfo.percentage}%
                            </div>
                        </div>
                    </div>
                    }

            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-between">
                    <div>
                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="inputGroupFile01" multiple onChange={selectFiles}/>
                        </div>
                    </div>
                    <div>
                        <button
                            className="btn btn-success "
                            disabled={!selectedFiles}
                            onClick={uploadFiles}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>

            {message.length > 0 && (
                <div className="alert alert-secondary Srolable" role="alert">
                    <ul>
                        {message.map((item, i) => {
                            return <li key={i}>{item}</li>;
                        })}
                    </ul>
                </div>
            )}

            <div className="card">
                <div className="card-header">List of Files</div>
                <ol className="list-group list-group-numbered Srolable">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item d-flex justify-content-between align-items-start" key={index}>
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{file.name}</div>
                                    {file.hash}
                                </div>
                                <button className="btn btn-success btn-sm" onClick={() => downloadFile(file.hash)}>Download</button>
                            </li>
                        ))}
                </ol>
            </div>

            <div className="row mb-3 mt-3">
                <div className="col-12 d-flex justify-content-between">
                    <button className="btn btn-warning" disabled={!fileInfos} onClick={tamper}>Tamper with Tree</button>
                    <button className="btn btn-danger" disabled={!fileInfos} onClick={destroyTree}>Destroy Tree</button>
                </div>
            </div>
        </div>
    );
};

export default FilesUpload;
