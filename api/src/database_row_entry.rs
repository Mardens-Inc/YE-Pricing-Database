use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseRowEntry {
    pub id: i32,
    pub tag_number: i32,
    pub store: i32,
    pub department: i32,
    pub percent: f32,
    pub mardens_price: f32,
    pub quantity: i32,
    pub description: String,
    pub employee: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseInsertEntry {
    pub tag_number: i32,
    pub store: i32,
    pub department: i32,
    pub percent: f32,
    pub mardens_price: f32,
    pub quantity: i32,
    pub description: String,
    pub employee: i32,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseUpdateEntry {
    pub id: i32,
    pub tag_number: i32,
    pub store: i32,
    pub department: i32,
    pub percent: f32,
    pub mardens_price: f32,
    pub quantity: i32,
    pub description: String,
    pub employee: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DBResult {
    pub data: Vec<DatabaseRowEntry>,
    pub per_page: i32,
    pub current_page: i32,
    pub last_page: i32,
    pub count: i32,
    pub total: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Employee {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub location: String,
}