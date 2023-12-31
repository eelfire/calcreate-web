use axum::{
    extract::{Path, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode, Uri},
    response::{Html, IntoResponse},
    routing::get,
    Json, Router,
};
use dotenvy::dotenv;
use rusqlite::{Connection, Result};
use serde_json::{json, Value};
use std::{env, error::Error};
use tower_http::{cors::CorsLayer, services::ServeDir};

mod parser;

#[derive(Debug)]
struct Person {
    id: i32,
    name: String,
    data: Option<Vec<u8>>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // let _ = db();

    let courses = parser::parse().unwrap();

    // build our application with a single route
    let app = Router::new()
        .route("/crow", get(|| async { "crow" }))
        .route("/api/:id", get(api))
        .with_state(courses)
        // .route("/", get(static_file_handler));
        .merge(static_file_handler())
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:5173".parse::<HeaderValue>().unwrap())
                .allow_methods([Method::GET]),
        );

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}

fn static_file_handler() -> Router {
    Router::new().nest_service(
        "/",
        ServeDir::new("../frontend/dist").not_found_service(handler_404.into_service()),
    )
    // .not_found_service(ServeFile::new("../frontend/dist/index.html"))
}

async fn handler_404() -> impl IntoResponse {
    let html_respone_404 = Html(
        r#"
        <html>
            <head>
                <meta charset="utf-8">
                <title>you got lost</title>
                <!-- <meta http-equiv="refresh" content="0; url=/"> -->
            </head>
            <body style="text-align:center;">
                <div style="font-size:690%;">
                    <p>nah ah!!</p>
                    <p>charso char</p>
                </div>
                <p><a href="/">go here</a></p>
                <p><a href="https://youtu.be/dQw4w9WgXcQ?si=EQ58_Kv3yAoto-ry">or go here</a></p>
            </body>
        </html>
        "#,
    );
    (StatusCode::NOT_FOUND, html_respone_404)
}

async fn api(Path(id): Path<String>, State(courses): State<Value>) -> Json<Value> {
    // let courses = parser::parse().unwrap();
    let test_json = json!({
            "id": 1,
            "name": "Etho",
            "age": "washed up",
    });

    match id.as_str() {
        "courses" => Json(courses),
        "etho" => Json(test_json),
        _ => Json(json!({ "error": "nah ah!! - 404" })),
    }
}

fn db() -> Result<()> {
    dotenv().ok();

    let local_db = env::var("LOCAL_DB").unwrap();
    println!("local_db: {}", local_db);

    let conn = Connection::open(local_db)?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS person (
            id      INTEGER PRIMARY KEY,
            name    TEXT NOT NULL,
            data    BLOB
            )",
        (),
    )?;

    let a_person = Person {
        id: 0,
        name: "Etho".to_string(),
        data: None,
    };
    conn.execute(
        "INSERT INTO person (name, data) VALUES (?1, ?2)",
        (&a_person.name, &a_person.data),
    )?;

    let mut stmt = conn.prepare("SELECT id, name, data FROM person")?;
    let person_iter = stmt.query_map([], |row| {
        Ok(Person {
            id: row.get(0)?,
            name: row.get(1)?,
            data: row.get(2)?,
        })
    })?;

    for person in person_iter {
        println!("found person {:?}", person.unwrap());
    }
    Ok(())
}
