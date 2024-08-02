mod database_row_entry;
mod db_access;
mod httaccess;

use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	HttpServer::new(|| {
		App::new()
	})
		.bind(("127.0.0.1", 1870))?
		.run()
		.await
}
