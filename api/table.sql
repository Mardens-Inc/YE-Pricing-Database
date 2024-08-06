DROP TABLE IF EXISTS `years-end-inventory`;
CREATE TABLE IF NOT EXISTS `years-end-inventory`
(
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `tag_number`    INT NOT NULL,
    `store`         INT NOT NULL,
    `department`    INT NOT NULL,
    `percent`       FLOAT    DEFAULT 0,
    `mardens_price` FLOAT    DEFAULT 0,
    `quantity`      INT      DEFAULT 0,
    `description`   TEXT     DEFAULT NULL,
    `employee`      INT NOT NULL,
    `created_at`    DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
