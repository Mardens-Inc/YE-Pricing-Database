use actix_web::{web, App, HttpServer};

use httaccess::{insert, range};

mod database_config;
mod database_row_entry;
mod db_access;
mod httaccess;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = get_config().await;
    // Start the server

    println!("Server running at http://127.0.0.1:1870/");
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(config.clone()))
            .service(range)
            .service(insert)
    })
    .bind(("127.0.0.1", 1870))?
    .run()
    .await
}

async fn get_config() -> database_config::DatabaseConfig {
    let client = reqwest::Client::new();
    let res = client
        .get("https://lib.mardens.com/config.json")
        .send()
        .await
        .unwrap();
    let body = res.text().await.unwrap();
    let config: database_config::DatabaseConfig = serde_json::from_str(&body).unwrap();
    config
}
