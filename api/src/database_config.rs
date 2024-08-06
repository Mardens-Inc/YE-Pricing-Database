use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Filemaker {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DatabaseConfig {
    pub host: String,
    pub user: String,
    pub password: String,
    pub filemaker: Filemaker,
    pub hash: String,
}
