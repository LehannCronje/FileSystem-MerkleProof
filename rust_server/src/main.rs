mod merkle_tree;
use actix_web::{get, post, App, HttpResponse, HttpServer};
use actix_cors::Cors;
use merkle_tree::MerkleTree;
use serde::Serialize;
use actix_multipart::form::{
        tempfile::{TempFile, TempFileConfig},
        MultipartForm,
    };
use std::sync::Mutex;

#[derive(Serialize)]
pub struct File {
    name: String,
    hash: String,
    base64: String,
}

#[derive(MultipartForm)]
struct Upload {
    files: Vec<TempFile>
}

#[post("/upload")]
async fn upload(
    MultipartForm(form): MultipartForm<Upload>,
) -> HttpResponse {
    for f in form.files {
        let path = format!("./tmp/{}", f.file_name.unwrap());
        f.file.persist(path).unwrap();
    }

    HttpResponse::Ok().into()
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::fs::create_dir_all("./tmp")?;

    HttpServer::new(|| {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(TempFileConfig::default().directory("./tmp"))
            .service(upload)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}