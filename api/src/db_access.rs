use actix_web::web::Data;
use mysql::prelude::Queryable;

use crate::database_config::DatabaseConfig;
use crate::database_row_entry::{DatabaseInsertEntry, DatabaseRowEntry, DBResult};

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
	let mut cmd = "select * from `years-end-inventory` where ".to_string();

	let mut args = vec![];

	if query.len() > 0 {
		cmd.push_str("concat_ws(' ', `tag_number`, `description`, `employee`, `created_at`, `updated_at`) like ? and ");
		args.push(mysql::Value::from(format!("%{}%", query)));
	}
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
	if from.len() > 0 {
		cmd.push_str("`created_at` >= ? and ");
		args.push(mysql::Value::from(from));
	}
	if to.len() > 0 {
		cmd.push_str("`created_at` <= ? and ");
		args.push(mysql::Value::from(to));
	}

	cmd.push_str(
		format!(
			"1 = 1 order by `{}` {} limit {} offset {}",
			sort,
			if asc { "asc" } else { "desc" },
			limit,
			(std::cmp::max(1, page) - 1) * limit
		)
			.as_str(),
	);

	let mut connection = match get_connection(config) {
		Ok(c) => c,
		Err(e) => return Err(e),
	};

	let mut count_cmd = cmd.clone();
	count_cmd = count_cmd.replace("*", "count(*)");
	count_cmd = count_cmd.split("limit").collect::<Vec<&str>>()[0].to_string();
	cmd = cmd.replace("*", format!("*,({}) as count,(select count(*) from `years-end-inventory`) as total", count_cmd).as_str());
	args.append(&mut args.clone());


	let mut count = -1;
	let mut total: i32 = -1;

	println!("cmd: {}", cmd);

	let result = match connection.exec_map(cmd.as_str(), &args, |row: mysql::Row| -> DatabaseRowEntry
	{
		if count == -1 {
			count = row.get("count").unwrap_or(0);
		}
		if total == -1 {
			total = row.get("total").unwrap_or(0);
		}
		DatabaseRowEntry {
			id: row.get("id").unwrap_or_default(),
			tag_number: row.get("tag_number").unwrap_or_default(),
			store: row.get("store").unwrap_or_default(),
			department: row.get("department").unwrap_or_default(),
			percent: row.get("percent").unwrap_or_default(),
			mardens_price: row.get("mardens_price").unwrap_or_default(),
			quantity: row.get("quantity").unwrap_or_default(),
			description: row.get("description").unwrap_or(String::new()),
			employee: row.get("employee").unwrap_or_default(),
			created_at: (row.get("created_at").unwrap_or(chrono::NaiveDateTime::default())).format("%F %X").to_string(),
			updated_at: (row.get("updated_at").unwrap_or(chrono::NaiveDateTime::default())).format("%F %X").to_string(),
		}
	},
	) {
		Ok(r) => r,
		Err(e) => return Err(e.to_string()),
	};


	Ok(DBResult {
		data: result,
		count,
		total,
		per_page: limit,
		current_page: page,
		last_page: (count as f32 / limit as f32).ceil() as i32,
	})
}

fn get_connection(config: Data<DatabaseConfig>) -> Result<mysql::PooledConn, String> {
	let url = format!(
		"mysql://{}:{}@{}:{}/{}",
		config.user, config.password, config.host, 3306, "stores"
	);
	let pool = match mysql::Pool::new(url.as_str()) {
		Ok(p) => p,
		Err(e) => return Err(e.to_string()),
	};
	Ok(pool.get_conn().unwrap())
}

pub fn insert(config: Data<DatabaseConfig>, entry:DatabaseInsertEntry) -> Result<(), String> {
	Ok(())
}