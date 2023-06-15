# Rust_Server

Server that stores uploaded files in a Merkle Tree. This implementation is not finished.

`Actix v0.11.1` was used for the web-server.

# Run
run `cargo run`

# Build

run `cargo build`

# Endpoints
###

`POST /upload`

Receives form data for Multipart files and hashes and saves them locally in a temp directory
```
Request - form data
{
    files: [MultipartFile],
}
```

# After Thoughts
I enjoyed starting this project with rust. Although I lacked time to implement it fully, I started learning and understanding the inner workings of rust. I spent a lot of time reading and understanding the syntax and operations.

My aim for this project would have been to implement the Merkle Tree, and use Actors given by the Actix framework to communicate via messages to update the Merkle Tree when specific actions would've been called.

One thing that prevented me from moving forward was fully using the ownership of variables correctly. This however will improve as I read more and understand more.
