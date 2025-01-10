use actix_web::web::Data;
use actix_web::{delete, get, patch, post, web, HttpRequest, HttpResponse, Responder};
use serde_json::json;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use urlencoding::decode;
use web::Json;

use crate::database_config::DatabaseConfig;
use crate::database_row_entry::DatabaseInsertEntry;
use crate::db_access;

#[get("/")]
pub async fn range(config: Data<DatabaseConfig>, request: HttpRequest) -> impl Responder {
    // Create a HashMap to hold query string parameters
    let params: HashMap<&str, &str> = request
        .query_string()
        .split("&")
        .map(|x| {
            // Split each parameter into key and value
            let mut split = x.split("=");
            (split.next().unwrap(), split.next().unwrap_or(""))
        })
        .collect();

    // Extract parameters from the hashmap or use default values where necessary
    let query: &str = params.get("query").unwrap_or(&"");
    let limit = params
        .get("limit")
        .and_then(|x| x.parse().ok())
        .unwrap_or(10); // Default limit is 10
    let page = params.get("page").and_then(|x| x.parse().ok()).unwrap_or(1); // Default page is 1
    let sort: &str = params.get("sort").unwrap_or(&"id"); // Default sort is by 'id'
    let asc = params
        .get("asc")
        .and_then(|x| x.parse().ok()) // Parse boolean
        .unwrap_or(false); // Default is ascending order
    let employee = params
        .get("employee")
        .and_then(|x| x.parse().ok())
        .unwrap_or(-1); // Default is -1 (considered as no employee filter)
    let store = params
        .get("store")
        .and_then(|x| x.parse().ok())
        .unwrap_or(-1); // Default is -1 (considered as no store filter)
    let department = params
        .get("department")
        .and_then(|x| x.parse().ok())
        .unwrap_or(-1); // Default is -1 (considered as no department filter)
    let tag_number = params
        .get("tag_number")
        .and_then(|x| x.parse().ok())
        .unwrap_or(-1); // Default is -1 (considered as no tag number filter)
    let from: &str = params.get("from").unwrap_or(&""); // Dates with no input considered as open-ended
    let to: &str = params.get("to").unwrap_or(&""); // Dates with no input considered as open-ended

    // remove any URI encoding from the query
    let q = decode(query).expect("UTF-8"); // Expecting the query to be encoded in UTF-8
    let query = q.to_string();
    let query = query.as_str();

    // Handle data access call and possible errors
    match db_access::range(
        config,
        query,
        limit,
        std::cmp::max(1, page),
        sort,
        asc,
        employee,
        store,
        department,
        tag_number,
        from,
        to,
    ) {
        Ok(result) => HttpResponse::Ok().json(result), // Return the successful result as a JSON response
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})), // Return errors as a JSON response
    }
}

#[post("/")]
pub async fn insert(
    config: Data<DatabaseConfig>,
    entry: Json<DatabaseInsertEntry>,
) -> HttpResponse {
    // Handle data access call and possible errors
    match db_access::insert(config, entry.into_inner()) {
        Ok(_) => HttpResponse::Ok().finish(), // Return a 200 OK response on success
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})), // Return errors as a JSON response
    }
}

#[patch("/")]
pub async fn update(
    config: Data<DatabaseConfig>,
    query: web::Query<UpdateQuery>,
    entry: Json<DatabaseInsertEntry>,
) -> HttpResponse {
    // Handle data access call and possible errors
    match db_access::update(config, query.id, entry.into_inner()) {
        Ok(_) => HttpResponse::Ok().finish(), // Return a 200 OK response on success
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})), // Return errors as a JSON response
    }
}

#[delete("/")]
pub async fn delete(config: Data<DatabaseConfig>, query: web::Query<UpdateQuery>) -> HttpResponse {
    // Handle data access call and possible errors
    match db_access::delete(config, query.id) {
        Ok(_) => HttpResponse::Ok().finish(), // Return a 200 OK response on success
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})), // Return errors as a JSON response
    }
}

#[delete("/truncate")]
pub async fn truncate(config: Data<DatabaseConfig>) -> HttpResponse {
    // Handle data access call and possible errors
    match db_access::truncate(config) {
        Ok(_) => HttpResponse::Ok().finish(), // Return a 200 OK response on success
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})), // Return errors as a JSON response
    }
}

#[get("/export")]
pub async fn export(config: Data<DatabaseConfig>, request: HttpRequest) -> impl Responder {
    // Create a HashMap to hold query string parameters
    let params: HashMap<&str, &str> = request
        .query_string()
        .split("&")
        .map(|x| {
            // Split each parameter into key and value
            let mut split = x.split("=");
            (split.next().unwrap(), split.next().unwrap_or(""))
        })
        .collect();

    // Extract parameters from the hashmap or use default values where necessary
    let query: Option<String> = params.get("query").map(|x| x.to_string());
    let employee: Option<u64> = params.get("employee").and_then(|x| x.parse().ok());
    let store: Option<u64> = params.get("store").and_then(|x| x.parse().ok());
    let department: Option<u64> = params.get("department").and_then(|x| x.parse().ok());


    match db_access::export(config, query, employee, store, department).await {
        Ok((result, filename)) => HttpResponse::Ok()
            .insert_header(("Content-Type", "text/csv"))
            .insert_header((
                "Content-Disposition",
                format!("attachment; filename={}.csv", filename),
            ))
            .body(result),
        Err(e) => HttpResponse::InternalServerError().json(json!({"error": e})),
    }
}

#[get("")]
pub async fn readonly(is_readonly: Data<Arc<Mutex<bool>>>) -> impl Responder {
    if let Ok(is_readonly) = is_readonly.lock() {
        HttpResponse::Ok().json(json!({
            "is_readonly": is_readonly.clone()
        }))
    } else {
        HttpResponse::InternalServerError().json(json!({"error": "Could not get is_readonly"}))
    }
}

#[post("")]
pub async fn toggle_readonly_mode(is_readonly: Data<Arc<Mutex<bool>>>) -> impl Responder {
    if let Ok(mut is_readonly) = is_readonly.lock() {
        *is_readonly = !*is_readonly;
        HttpResponse::Ok().json(json!({
            "is_readonly": is_readonly.clone()
        }))
    } else {
        HttpResponse::InternalServerError().json(json!({"error": "Could not get is_readonly"}))
    }
}

#[derive(serde::Deserialize)]
struct UpdateQuery {
    id: i32,
}

#[get("ping")]
pub async fn ping() -> impl Responder {
    HttpResponse::Ok().finish()
}
