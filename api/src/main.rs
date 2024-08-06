use actix_web::{App, HttpServer, web};

use httaccess::{delete, insert, range, update};

mod database_config;
mod database_row_entry;
mod db_access;
mod httaccess;
#[actix_web::main]
async fn main() -> std::io::Result<()> {
	let config = match get_config().await {
		Ok(config) => config,
		Err(e) => panic!("Failed to retrieve database configuration: {}", e)
	};
	// Start the server

	println!("Server running at http://127.0.0.1:1870/");
	HttpServer::new(move || {
		App::new()
			.app_data(web::Data::new(config.clone()))
			.service(range)
			.service(insert)
			.service(update)
			.service(delete)
	})
		.bind(("127.0.0.1", 1870))?
		.run()
		.await
}

/// Asynchronously retrieves the database configuration by making a GET request to the specified URL.
///
/// # Returns
///
/// A `DatabaseConfig` struct that represents the retrieved configuration.
///
/// # Panics
///
/// This function will panic if any of the following operations fail:
/// - Creating a new `reqwest::Client`.
/// - Sending the GET request using the client.
/// - Retrieving the response body as text.
/// - Parsing the response body as JSON into a `DatabaseConfig` struct.
///
/// # Example
/// ```
/// use database_config::DatabaseConfig;
///
/// #[tokio::main]
/// async fn main() {
///     let config = get_config().await;
///     println!("{:?}", config);
/// }
/// ```
async fn get_config() -> Result<database_config::DatabaseConfig, String> {
	let client = reqwest::Client::new();
	let res = match client
		.get("https://lib.mardens.com/config.json")
		.send()
		.await {
		Ok(res) => res,
		Err(e) => return Err(e.to_string())
	};
	let body = res.text().await.unwrap();
	let config: database_config::DatabaseConfig = serde_json::from_str(&body).unwrap();
	Ok(config)
}
