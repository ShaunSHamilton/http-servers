// use std::fs;
use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;
// use std::thread;
// use std::time::Duration;

mod lib;
use crate::lib::ThreadPool;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:3003").unwrap();
    let pool = ThreadPool::new(7);

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        pool.execute(|| {
            handle_connection(stream);
        });
    }

    println!("Shutting down.");
}

fn handle_connection(mut stream: TcpStream) {
    // let mut buffer = [0; 1024];
    // stream.read(&mut buffer).unwrap();

    let response = "HTTP/1.1 200 OK\r\n\r\n";

    stream.write_all(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
