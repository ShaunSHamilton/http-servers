# HTTP Servers

A collection of HTTP servers to compare performance and DX.

## Usage

There are three routes for testing:

| Route           | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| `GET /`         | Returns a simple string.                                                                 |
| `GET /user`     | Auth0 verified fetch from MongoDB                                                        |
| `POST /complex` | A complex request performing various transformations on data Read and Updated on MongoDB |

## Servers

A table of the servers, how complete they are, and their performance:

| Server   | Basic \| Auth | Performance |
| -------- | ------------- | ----------- |
| Actix    | Basic         | ?           |
| Express  | Basic         | ?           |
| Fastify  | Basic         | ?           |
| Koa      | Basic         | ?           |
| Rocket   | Basic         | ?           |
| Rust TCP | Basic         | ?           |
