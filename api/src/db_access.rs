use actix_web::web::Data;
use mysql::prelude::Queryable;
use std::collections::HashMap;

use crate::database_config::DatabaseConfig;
use crate::database_row_entry::{DBResult, DatabaseInsertEntry, DatabaseRowEntry, Employee};

/// Executes a database query to retrieve a range of records based on the provided parameters.
///
/// # Arguments
///
/// * `config` - The configuration data of the database.
/// * `query` - The search query to filter the records. If an empty string is provided, no filtering is applied.
/// * `limit` - The maximum number of records to retrieve.
/// * `page` - The page number of the records to retrieve.
/// * `sort` - The column to sort the records by.
/// * `asc` - A flag indicating whether to sort the records in ascending order (`true`) or descending order (`false`).
/// * `employee` - The ID of the employee to filter the records by. If a negative value is provided, no filtering is applied.
/// * `store` - The ID of the store to filter the records by. If a negative value is provided, no filtering is applied.
/// * `department` - The ID of the department to filter the records by. If a negative value is provided, no filtering is applied.
/// * `tag_number` - The tag number to filter the records by. If a negative value is provided, no filtering is applied.
/// * `from` - The minimum creation date to filter the records by. If an empty string is provided, no filtering is applied.
/// * `to` - The maximum creation date to filter the records by. If an empty string is provided, no filtering is applied.
///
/// # Returns
///
/// A `Result` containing a `DBResult` if the query is executed successfully, or a `String` error message otherwise.
pub fn range(
	config: Data<DatabaseConfig>,
	query: &str,
	limit: i32,
	page: i32,
	sort: &str,
	asc: bool,
	employee: i32,
	store: i32,
	department: i32,
	tag_number: i32,
	from: &str,
	to: &str,
) -> Result<DBResult, String> {
	// Start with the base query. The specific conditions will be added dynamically based on provided arguments.
	let mut cmd = "select * from `years-end-inventory` where ".to_string();

	// This vector will store the parameters that we bind to our SQL command.
	let mut args = vec![];

	// If a query string is provided, add a condition to the SQL command.
	if query.len() > 0 {
		cmd.push_str("concat_ws(' ', `tag_number`, `description`, `employee`, `created_at`, `updated_at`) like ? and ");
		args.push(mysql::Value::from(format!("%{}%", query)));
	}

	// Add conditions for employee, store, department and tag_number if they are greater than -1
	if employee > -1 {
		cmd.push_str("`employee` = ? and ");
		args.push(mysql::Value::from(employee));
	}
	if store > -1 {
		cmd.push_str("`store` = ? and ");
		args.push(mysql::Value::from(store));
	}
	if department > -1 {
		cmd.push_str("`department` = ? and ");
		args.push(mysql::Value::from(department));
	}
	if tag_number > -1 {
		cmd.push_str("`tag_number` = ? and ");
		args.push(mysql::Value::from(tag_number));
	}

	// If `from` and `to` strings are provided, add condition to the SQL command.
	if from.len() > 0 {
		cmd.push_str("`created_at` >= ? and ");
		args.push(mysql::Value::from(from));
	}
	if to.len() > 0 {
		cmd.push_str("`created_at` <= ? and ");
		args.push(mysql::Value::from(to));
	}

	// Set the ordering and paging clause of the command.
	cmd.push_str(
		format!(
			"1 = 1 order by `{}` {} limit {} offset {}",
			sort,
			// Decide the sorting order
			if asc { "asc" } else { "desc" },
			// Total number of records per page
			limit,
			// Starting index for record of a page
			(std::cmp::max(1, page) - 1) * limit
		)
			.as_str(),
	);

	// Establish a connection to the database.
	let mut connection = match get_connection(config) {
		Ok(c) => c,
		Err(e) => return Err(e),
	};

	// Create a copy of our SQL command that we can use to count the number of matching records.
	let mut count_cmd = cmd.clone();
	count_cmd = count_cmd.replace("*", "count(*)");
	count_cmd = count_cmd.split("limit").collect::<Vec<&str>>()[0].to_string();

	// Modify our SQL command to retrieve the total number of records and the count of matching records.
	cmd = cmd.replace(
		"*",
		format!(
			"*,({}) as count,(select count(*) from `years-end-inventory`) as total",
			count_cmd
		)
			.as_str(),
	);
	args.append(&mut args.clone());

	// Declare variables to store our count and total.
	let mut count = -1;
	let mut total: i32 = -1;

	println!("cmd: {}", cmd);

	// Execute our SQL command and populate the DBResult with a list of DatabaseRowEntry objects.
	let result =
		match connection.exec_map(cmd.as_str(), &args, |row: mysql::Row| -> DatabaseRowEntry {
			// If count and total haven't been set yet, assign them values from the current row.
			if count == -1 {
				count = row.get("count").unwrap_or(0);
			}
			if total == -1 {
				total = row.get("total").unwrap_or(0);
			}

			// Create and return a DatabaseRowEntry by populating it with values from the current row.
			DatabaseRowEntry {
				// Each field of the DatabaseRowEntry struct is fetched from the row of data 
				// from the database. If the field cannot be fetched, or is NULL, a default value is used instead.
				id: row.get("id").unwrap_or_default(),
				tag_number: row.get("tag_number").unwrap_or_default(),
				store: row.get("store").unwrap_or_default(),
				department: row.get("department").unwrap_or_default(),
				percent: row.get("percent").unwrap_or_default(),
				mardens_price: row.get("mardens_price").unwrap_or_default(),
				quantity: row.get("quantity").unwrap_or_default(),
				description: row.get("description").unwrap_or(String::new()), // An empty string is used as the default value when 'description' is NULL.
				employee: row.get("employee").unwrap_or_default(),

				// 'created_at' and 'updated_at' are fetched as chrono::NaiveDateTime objects from the database.
				// If they cannot be fetched or are NULL, the current time is used as the default value.
				// After retrieving these datetime objects, they are formatted as strings in the "YYYY-MM-DD HH:MM:SS" format.
				created_at: (row
					.get("created_at")
					.unwrap_or(chrono::NaiveDateTime::default()))
					.format("%F %X")
					.to_string(),
				updated_at: (row
					.get("updated_at")
					.unwrap_or(chrono::NaiveDateTime::default()))
					.format("%F %X")
					.to_string(),
			}
		}) {
			Ok(r) => r,
			Err(e) => return Err(e.to_string()),
		};

	// Assemble and return our DBResult.
	Ok(DBResult {
		data: result,
		count,
		total,
		per_page: limit,
		current_page: page,
		last_page: (count as f32 / limit as f32).ceil() as i32,
	})
}

/// Returns a connection to the MySQL database based on the given configuration.
///
/// # Arguments
///
/// * `config` - The data containing the database configuration.
///
/// # Returns
///
/// A `Result` that either contains a connection to the MySQL database or an error message.
///
/// # Example
///
/// ```
/// use std::sync::Arc;
/// use tokio::sync::RwLock;
///
/// #[derive(Debug, Clone)]
/// struct DatabaseConfig {
///     user: String,
///     password: String,
///     host: String,
/// }
///
/// #[tokio::main]
/// async fn main() {
///     let config = Data {
///         user: "username".to_owned(),
///         password: "password".to_owned(),
///         host: "localhost".to_owned(),
///     };
///
///     match get_connection(config) {
///         Ok(connection) => {
///             // Successfully obtained a connection to the database
///             // Perform database operations here
///         },
///         Err(error) => {
///             // Failed to obtain a connection to the database
///             eprintln!("Error: {}", error);
///         },
///     }
/// }
/// ```
fn get_connection(config: Data<DatabaseConfig>) -> Result<mysql::PooledConn, String> {
	// Format our database URL by interpolating user credentials, host and database name into the MySQL URL format
	let url = format!(
		"mysql://{}:{}@{}:{}/{}",
		config.user, config.password, config.host, 3306, "stores"
	);

	// Attempt to establish a new database connection pool using the generated URL
	let pool = match mysql::Pool::new(url.as_str()) {
		// If pool creation is successful, proceed
		Ok(p) => p,
		// If pool creation fails, return an error indicating the reason for the failure.
		Err(e) => return Err(e.to_string()),
	};

	// Retrieve a connection from the established pool. unwrap is used here to immediately
	// terminate the program in case there are no more connections available in the pool. 
	Ok(pool.get_conn().unwrap())
}

/// Inserts a new entry into the database.
///
/// # Arguments
///
/// * `config` - A reference to the `DatabaseConfig` struct.
/// * `entry` - The `DatabaseInsertEntry` containing the data to insert.
///
/// # Returns
///
/// * `Ok(())` - If the insertion was successful.
/// * `Err(String)` - If an error occurred during the insertion.
pub fn insert(config: Data<DatabaseConfig>, entry: DatabaseInsertEntry) -> Result<(), String> {
	// Obtain a connection to the database, from the given configuration.
	let mut connection = match get_connection(config) {
		// If successful, proceed to the next stage.
		Ok(c) => c,
		// If an error occurs, return the error message.
		Err(e) => return Err(e),
	};

	// Create the SQL command for inserting the data into the database.
	let cmd = "insert into `years-end-inventory` (tag_number, store, department, percent, mardens_price, quantity, description, employee) values (?, ?, ?, ?, ?, ?, ?, ?)";

	// Create a vector to hold the arguments for the SQL command.
	let args = vec![
		mysql::Value::from(entry.tag_number),
		mysql::Value::from(entry.store),
		mysql::Value::from(entry.department),
		mysql::Value::from(entry.percent),
		mysql::Value::from(entry.mardens_price),
		mysql::Value::from(entry.quantity),
		mysql::Value::from(entry.description),
		mysql::Value::from(entry.employee),
	];

	// Attempt to execute the SQL command with the provided arguments.
	match connection.exec_drop(cmd, args) {
		// If successful, return a success value.
		Ok(_) => Ok(()),
		// If an error occurs, return the error message.
		Err(e) => return Err(e.to_string()),
	}
}

/// Delete a record from the database.
///
/// # Arguments
///
/// * `config` - The database configuration.
/// * `id` - The unique identifier of the record to delete.
///
/// # Returns
///
/// This function returns a `Result` indicating whether the record was successfully deleted or an error message if something went wrong.
///
/// - If the record is deleted successfully, the `Result` will contain `Ok(())`.
/// - If an error occurs, the `Result` will contain `Err(String)` with the error message.
///
/// # Example
///
/// ```rust
/// use actix_web::web::Data;
/// use mysql::prelude::*;
///
/// fn delete(config: Data<DatabaseConfig>, id: i32) -> Result<(), String> {
///     // Code implementation goes here
/// }
/// ```
pub fn delete(config: Data<DatabaseConfig>, id: i32) -> Result<(), String> {
	// Attempt to establish a connection to the database using the provided configuration.
	let mut connection = match get_connection(config) {
		// Connection was successfully established.
		Ok(c) => c,
		// An error occurred, return immediately with error message.
		Err(e) => return Err(e),
	};

	// SQL command to delete a row in `years-end-inventory` table where id matches with the provided id.
	let cmd = "delete from `years-end-inventory` where id = ?";

	// Create arguments for the SQL command. In this case, we only need the id of the row to be deleted.
	let args = vec![mysql::Value::from(id)];

	// Execute the deletion command.
	match connection.exec_drop(cmd, args) {
		// The operation was successful, return immediately with success.
		Ok(_) => Ok(()),
		// An error occurred, return immediately with the error message.
		Err(e) => return Err(e.to_string()),
	}
}

/// Updates a record in the "years-end-inventory" table with the given entry.
///
/// # Arguments
///
/// * `config`: A shared reference to the database configuration.
/// * `id`: The ID of the record to update.
/// * `entry`: The new entry to update the record with.
///
/// # Returns
///
/// Returns `Ok(())` upon successful update, or `Err(String)` if an error occurs.
pub fn update(
	config: Data<DatabaseConfig>,
	id: i32,
	entry: DatabaseInsertEntry,
) -> Result<(), String> {
	// Establish a connection to the database using the passed configuration
	let mut connection = match get_connection(config) {
		Ok(c) => c,
		Err(e) => return Err(e), // return early with error message if connection fails
	};

	// This is the SQL command that updates the record in the `years-end-inventory` table
	let cmd = "update `years-end-inventory` set tag_number = ?, store = ?, department = ?, percent = ?, mardens_price = ?, quantity = ?, description = ?, employee = ? where id = ?";

	// Create a vector for arguments to be substituted in the SQL command placeholders (?)
	// The order of these arguments must match the order of the placeholders in the SQL command 
	let args = vec![
		mysql::Value::from(entry.tag_number),
		mysql::Value::from(entry.store),
		mysql::Value::from(entry.department),
		mysql::Value::from(entry.percent),
		mysql::Value::from(entry.mardens_price),
		mysql::Value::from(entry.quantity),
		mysql::Value::from(entry.description),
		mysql::Value::from(entry.employee),
		mysql::Value::from(id),
	];

	// Execute the update command with the provided arguments.
	// If successful, return Ok. If not, return error message
	match connection.exec_drop(cmd, args) {
		Ok(_) => Ok(()),
		Err(e) => return Err(e.to_string()),
	}
}

pub async fn export(config: Data<DatabaseConfig>) -> Result<String, String> {
	let mut connection = match get_connection(config) {
		Ok(c) => c,
		Err(e) => return Err(e),
	};
	let client =
		match reqwest::Client::builder()
			.danger_accept_invalid_certs(true)
			.build() {
			Ok(c) => c,
			Err(e) => return Err(e.to_string()),
		};
	let employees: HashMap<i32, Employee> = match client
		.get("https://employees.mardens.com/api/")
		.send()
		.await
	{
		Ok(res) => {
			let employees: Vec<Employee> =
				match res.json().await
				{
					Ok(e) => e,
					Err(e) => return Err(e.to_string()),
				};
			employees.into_iter().map(|e| (e.employee_id, e)).collect()
		},
		Err(e) => return Err(e.to_string()),
	};

	let result: Vec<DatabaseRowEntry> =
		match connection.query_map("SELECT * FROM `years-end-inventory`", |row: mysql::Row| -> DatabaseRowEntry {
			DatabaseRowEntry {
				// Each field of the DatabaseRowEntry struct is fetched from the row of data 
				// from the database. If the field cannot be fetched, or is NULL, a default value is used instead.
				id: row.get("id").unwrap_or_default(),
				tag_number: row.get("tag_number").unwrap_or_default(),
				store: row.get("store").unwrap_or_default(),
				department: row.get("department").unwrap_or_default(),
				percent: row.get("percent").unwrap_or_default(),
				mardens_price: row.get("mardens_price").unwrap_or_default(),
				quantity: row.get("quantity").unwrap_or_default(),
				description: row.get("description").unwrap_or(String::new()), // An empty string is used as the default value when 'description' is NULL.
				employee: row.get("employee").unwrap_or_default(),

				// 'created_at' and 'updated_at' are fetched as chrono::NaiveDateTime objects from the database.
				// If they cannot be fetched or are NULL, the current time is used as the default value.
				// After retrieving these datetime objects, they are formatted as strings in the "YYYY-MM-DD HH:MM:SS" format.
				created_at: (row
					.get("created_at")
					.unwrap_or(chrono::NaiveDateTime::default()))
					.format("%F %X")
					.to_string(),
				updated_at: (row
					.get("updated_at")
					.unwrap_or(chrono::NaiveDateTime::default()))
					.format("%F %X")
					.to_string(),
			}
		}) {
			Ok(r) => r,
			Err(e) => return Err(e.to_string()),
		};

	let mut csv_writer = csv::Writer::from_writer(vec![]);
	csv_writer.write_record(&[
		"id",
		"tag_number",
		"store",
		"department",
		"percent",
		"mardens_price",
		"quantity",
		"description",
		"employee",
		"created_at",
		"updated_at",
	]).unwrap();

	let stores = vec![
		"Sanford",
		"Biddeford",
		"Scarborough",
		"Gray",
		"Lewiston",
		"Waterville",
		"Brewer",
		"Ellsworth",
		"Calais",
		"Lincoln",
		"Houlton",
		"Presque Isle",
		"Madawaska"
	];

	let departments = vec![
		"Clothing",
		"Shoes",
		"Hardware",
		"Furniture",
		"Flooring",
		"Fabric",
		"General",
		"Food"
	];
	for row in result {
		let mut store = row.store.to_string();
		let mut department = row.department.to_string();


		if row.store > 0 && row.store <= stores.len() as i32 {
			store = stores[row.store as usize - 1].to_string();
		}

		if row.department > 0 && row.department <= departments.len() as i32 {
			department = departments[row.department as usize - 1].to_string();
		}

		// map store index to store name
		let mut index = 0;
		while index < stores.len() {
			if row.store == index as i32 {
				store = stores[index].to_string();
				break;
			}
			index += 1;
		}

		// map department index to department name
		index = 0;
		while index < departments.len() {
			if row.department == index as i32 {
				department = departments[index].to_string();
				break;
			}
			index += 1;
		}

		// map employee id to employee name
		let mut employee = row.employee.to_string();
		if employees.contains_key(&row.employee) {
			employee = match employees.get(&row.employee) {
				Some(e) => format!("{} {}", e.first_name, e.last_name),
				None => format!("Unknown Employee ID {}", row.employee),
			};
		}


		csv_writer.write_record(&[
			row.id.to_string(),
			row.tag_number.to_string(),
			store,
			department,
			row.percent.to_string(),
			row.mardens_price.to_string(),
			row.quantity.to_string(),
			row.description,
			employee,
			row.created_at,
			row.updated_at,
		]).unwrap();
	}
	if csv_writer.flush().is_err() {
		return Err("Failed to flush CSV writer".to_string());
	}

	Ok(String::from_utf8(csv_writer.into_inner().unwrap()).unwrap())
}