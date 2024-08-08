# Years End Inventory Pricing Database

This is the repository for the Years End Inventory Pricing Database. This database is used to store the pricing information for all items in the inventory. The database is updated at the end of each year to reflect the current pricing for each item.   
This project is split into two parts: the database and the front-end application. The database is built using MySQL and the front-end application using the [TAVERN Framework](https://github.com/drew-chase/TAVERN-Stack).

## [Backend](api)

The backend rest api is built using [actix](https://actix.rs) framework using the [Rust](https://www.rust-lang.org/) programming language. The database is built using MySQL. The backend is responsible for handling all the requests from the front-end application and updating the database accordingly.
The backend api can be found in the [api](api) directory.

## [Frontend](src)

The front-end application allows users to view and update the pricing information for each item in the inventory. The front-end application is built using the [TAVERN Framework](https://github.com/drew-chase/TAVERN-Stack). The front-end application can be found in the [src](src) directory.

## Database

The database is built using MySQL. The database schema can be found below or in the [table.sql](api/table.sql) file.

| Column Name   | Type     | Null | Default           | Extras                      |
|---------------|----------|------|-------------------|-----------------------------|
| id            | INT      | No   | AUTO_INCREMENT    | PRIMARY KEY                 |
| tag_number    | INT      | No   | None              |                             |
| store         | INT      | No   | None              |                             |
| department    | INT      | No   | None              |                             |
| percent       | FLOAT    | Yes  | 0                 |                             |
| mardens_price | FLOAT    | Yes  | 0                 |                             |
| quantity      | INT      | Yes  | 0                 |                             |
| description   | TEXT     | Yes  | NULL              |                             |
| employee      | INT      | No   | None              |                             |
| created_at    | DATETIME | Yes  | CURRENT_TIMESTAMP |                             |
| updated_at    | DATETIME | Yes  | CURRENT_TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

## Screenshots
